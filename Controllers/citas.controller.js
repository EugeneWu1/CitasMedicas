import e from 'cors';
import {
    getAllAppointmentsFromUser,
    createAppointment,
    deleteAppointment,
    getAllScheduledAppointments,
    updateAppointment,
    checkDuplicateAppointment,
    checkServiceTimeConflict,
    getServiceInfo,
    calculateEndTime,
    checkUserExists,
    getAppointmentById,
    convertUserIdToUuid,
    getAvailableTimeSlots,
    getAllCancelledAppointments,
    getAllCompletedAppointments
} from '../Models/citas.models.js'
import { validateAppointments, validateAppointmentUpdate, validateAppointmentId, validateUserId } from '../Schemas/citas.schema.js'
import { v4 as uuidv4 } from 'uuid';


//Consultar todas las citas del cliente
export const getAll = async (req, res, next) => {
    try {
        const { id } = req.params
       
        // Validar el ID
        const idValidation = validateUserId(id)
        if (!idValidation.success) {
            const validationError = new Error('ID de usuario inválido')
            validationError.status = 400
            return next(validationError)
        }

        // Verificar que el usuario existe
        const userExists = await checkUserExists(id);
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: 'El usuario no existe'
            });
        }

        const appointmentsDB = await getAllAppointmentsFromUser(id)

        
        // Verificar si el usuario no tiene citas
        if (!appointmentsDB || appointmentsDB.length === 0) {
            return res.status(204).send(); // 204 No Content
        }

        res.status(200).json({
            success: true,
            data: appointmentsDB
        })

    } catch (error) {
        // Manejo de errores
        return next(error)
    }

    //TODO: PAGINACION
}

//Crear una cita 
export const create = async (req, res, next) => {
    try {
        const data = req.body;

        // Validar los datos con Zod
        const { success, data: safeData, error } = validateAppointments(data);
        
        if (!success) {
            const validationError = new Error(error.message);
            validationError.status = 400;
            return next(validationError);
        }

        // Verificar que el usuario existe
        const userExists = await checkUserExists(safeData.user_id);
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: 'El usuario no existe'
            });
        }

        // Verificar que el servicio existe y está disponible
        const serviceInfo = await getServiceInfo(safeData.service_id);
        if (!serviceInfo) {
            return res.status(404).json({
                success: false,
                message: 'El servicio no existe'
            });
        }

        if (!serviceInfo.available) {
            return res.status(400).json({
                success: false,
                message: 'El servicio no está disponible'
            });
        }

        // Verificar disponibilidad por horarios
        // Calcular end_time si no se proporciona
        if (!safeData.end_time && serviceInfo.duration) {
            safeData.end_time = calculateEndTime(safeData.start_time, serviceInfo.duration);
        }

        // Verificar que no haya conflictos de horario con CUALQUIER servicio
        const hasTimeConflict = await checkServiceTimeConflict(
            safeData.appointment_date, 
            safeData.start_time, 
            safeData.end_time
        );

        if (hasTimeConflict) {
            return res.status(409).json({
                success: false,
                message: 'El horario no está disponible. Ya existe una cita programada en ese horario.'
            });
        }

        // Verificar que el usuario no tenga otra cita en la misma fecha y hora
        const isDuplicate = await checkDuplicateAppointment(
            safeData.user_id, 
            safeData.appointment_date, 
            safeData.start_time
        );

        if (isDuplicate) {
            return res.status(409).json({
                success: false,
                message: 'Ya tiene una cita programada en esa fecha y hora'
            });
        }

        // Generar ID y crear la cita
        const appointmentId = uuidv4();
        const appointmentData = {
            appointment_id: appointmentId,
            ...safeData
        };

        const result = await createAppointment(appointmentData);

        res.status(201).json({
            success: true,
            message: 'Cita creada exitosamente',
            data: result
        });

    } catch (error) {
        console.error('Error en create:', error);
        return next(error);
    }
}

//Borrar una cita por el cliente
export const remove = async (req, res, next) => {
    try {
        const { id } = req.params

        // Validar el ID
        const { success } = validateAppointmentId(id)
        if (!success) {
            const validationError = new Error('ID de cita inválido')
            validationError.status = 400
            return next(validationError)
        }

        const result = await deleteAppointment(id)

        res.status(200).json({
            success: true,
            message: 'Cita eliminada correctamente',
            data: result
        });

    } catch (error) {
        return next(error)
    }
}

//ver todas las citas agendadas por el cliente
export const getAllScheduled = async (req, res, next) => {
    try {
        const appointmentsDB = await getAllScheduledAppointments()

        // Verificar si no hay citas programadas
        if (!appointmentsDB || appointmentsDB.length === 0) {
            return res.status(204).send(); // 204 No Content
        }

        res.status(200).json({
            success: true,
            data: appointmentsDB
        })

    } catch (error) {

        return next(error)
    }
}

//Actualizar cita
export const update = async (req, res, next) => {
    try {
        const { id } = req.params;

        // validar el ID
        const idValidation = validateAppointmentId(id)
        if (!idValidation.success) {
            const validationError = new Error('ID de cita inválido')
            validationError.status = 400
            return next(validationError)
        }

        // alidar los datos de entrada
        const { success, data, error } = validateAppointmentUpdate(req.body)
        
        if (!success) {
            const validationError = new Error(error.message);
            validationError.status = 400;
            return next(validationError); 
        }

        // Obtener información de la cita actual
        const existingAppointment = await getAppointmentById(id);

        if (!existingAppointment) {
            const validationError = new Error('La cita no existe');
            validationError.status = 404;
            return next(validationError);
        }

        // Recalcular end_time si es necesario
        if ((data.start_time || data.service_id) && !data.end_time) {
            const currentServiceId = data.service_id || existingAppointment.service_id;
            const serviceInfo = await getServiceInfo(currentServiceId);
            
            if (serviceInfo && serviceInfo.duration) {
                const currentStartTime = data.start_time || existingAppointment.start_time;
                data.end_time = calculateEndTime(currentStartTime, serviceInfo.duration);
            }
        }
        
        //  Verificar conflictos de horario
        if (data.appointment_date || data.start_time || data.end_time) {
            const newDate = data.appointment_date || existingAppointment.appointment_date;
            const newStartTime = data.start_time || existingAppointment.start_time;
            const newEndTime = data.end_time || existingAppointment.end_time;

            // Verificar conflictos de horario (excluyendo la cita actual)
            const hasConflict = await checkServiceTimeConflict(newDate, newStartTime, newEndTime, id);
            
            if (hasConflict) {
                return res.status(409).json({
                    success: false,
                    message: 'El horario solicitado no está disponible, hay conflicto con otra cita'
                });
            }
        }

        // Actualizar la cita
        const result = await updateAppointment(id, data);

        res.status(200).json({
            success: true,
            message: 'Cita actualizada exitosamente',
            data: result
        });

    } catch (error) {
        return next(error);
    }
}


// Obtener todas las citas canceladas
export const getAllCancelled = async (req, res, next) => {
    try {

        const appointmentsDB = await getAllCancelledAppointments()

        // Verificar si no hay citas canceladas
        if (!appointmentsDB || appointmentsDB.length === 0) {
            return res.status(204).send(); // 204 No Content
        }

        res.status(200).json({
            success: true,
            data: appointmentsDB
        })

    } catch (error) {

        return next(error)
    }
}

//Obtener todas las citas completadas
export const getAllCompleted = async (req, res, next) => {
    try {
        const appointmentsDB = await getAllCompletedAppointments();

        // Verificar si no hay citas completadas
        if (!appointmentsDB || appointmentsDB.length === 0) {
            return res.status(204).send(); // 204 No Content
        }

        res.status(200).json({
            success: true,
            data: appointmentsDB
        })

    } catch (error) {

        return next(error)
    } 
}


//Obtener horarios disponibles para un servicio en una fecha específica
export const getAvailableSlots = async (req, res, next) => {
    try {
        const { service_id, date } = req.query;

        if (!service_id || !date) {
            return res.status(400).json({
                success: false,
                message: 'service_id y date son requeridos'
            });
        }

        // Validar que el servicio existe
        const serviceInfo = await getServiceInfo(service_id);
        if (!serviceInfo) {
            return res.status(404).json({
                success: false,
                message: 'El servicio no existe'
            });
        }

        if (!serviceInfo.available) {
            return res.status(400).json({
                success: false,
                message: 'El servicio no está disponible'
            });
        }

        // Obtener horarios disponibles
        const availableSlots = await getAvailableTimeSlots(date, service_id);

        if (availableSlots.length === 0) {
            return res.status(204).send();
        }

        res.status(200).json({
            success: true,
            date: date,
            service: {
                id: service_id,
                name: serviceInfo.name,
                duration: serviceInfo.duration
            },
            available_slots: availableSlots
        });

    } catch (error) {
        console.error('Error en getAvailableSlots:', error);
        return next(error);
    }
}
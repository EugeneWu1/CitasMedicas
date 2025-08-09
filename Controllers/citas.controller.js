import {
    getAllAppointmentsFromUser,
    createAppointment,
    deleteAppointment,
    getAllScheduledAppointments,
    updateAppointment,
    checkDuplicateAppointment,
    checkTimeConflict,
    getServiceInfo,
    calculateEndTime
} from '../Models/citas.models.js'
import { cambiarDisponibilidad } from '../Models/servicios.models.js'
import { validateAppointments, validateAppointmentUpdate, validateAppointmentId, validateUserId } from '../Schemas/citas.schema.js'
import { v4 as uuidv4 } from 'uuid';

//Consultar todas las citas del cliente
export const getAll = async (req, res, next) => {
    try {
        const { id } = req.params
       
        // Validar el ID
        const idValidation = validateUserId(id);
        if (!idValidation.success) {
            const validationError = new Error('Datos inválidos.');
            validationError.status = 400;
            return next(validationError);
        }

        const appointmentsDB = await getAllAppointmentsFromUser(id)

        res.status(200).json({
            success: true,
            data: appointmentsDB
        })

    } catch (error) {
        // Manejo de errores
        next(error)
    }
}

//Crear una cita por el cliente
export const create = async (req, res, next) => {
    try {
        // Validar los datos de entrada
        const { success, data, error } = validateAppointments(req.body);
        
        if (!success) {
            return res.status(400).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors: error.errors
            });
        }

        const { user_id, service_id, appointment_date, start_time } = data;

        // 1. Verificar que el servicio existe y está disponible
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

        // 2. Calcular end_time basado en la duración del servicio
        const calculatedEndTime = data.end_time || calculateEndTime(start_time, serviceInfo.duration);

        // 3. Verificar que no existe una cita duplicada
        const isDuplicate = await checkDuplicateAppointment(user_id, appointment_date, start_time);
        
        if (isDuplicate) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe una cita para este usuario en la misma fecha y hora'
            });
        }

        // 4. Verificar conflictos de horario
        const hasConflict = await checkTimeConflict(appointment_date, start_time, calculatedEndTime);
        
        if (hasConflict) {
            return res.status(409).json({
                success: false,
                message: 'El horario solicitado no está disponible, hay conflicto con otra cita'
            });
        }

        // 5. Crear la cita
        const appointmentData = {
            appointment_id: uuidv4(),
            user_id,
            service_id,
            appointment_date,
            start_time,
            end_time: calculatedEndTime,
            status: data.status || 'scheduled',
            notes: data.notes || null
        };

        const result = await createAppointment(appointmentData);

        // 6. Cambiar disponibilidad del servicio a false (0)
        await cambiarDisponibilidad(service_id, 0);

        res.status(201).json({
            success: true,
            message: 'Cita creada exitosamente y servicio marcado como no disponible',
            data: appointmentData
        });

    } catch (error) {
        console.error('Error en create appointment:', error);
        next(error);
    }
}

//Borrar una cita por el cliente
export const remove = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validar el ID
        const { success, error } = validateAppointmentId(id);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: 'ID de cita inválido',
                errors: error.errors
            });
        }

        const result = await deleteAppointment(id);

        res.status(200).json({
            success: true,
            message: 'Cita eliminada correctamente',
            data: result
        });

    } catch (error) {
        next(error);
    }
}

//ver todas las citas agendadas por el cliente
export const getAllScheduled = async (req, res, next) => {
    try {
        const appointmentsDB = await getAllScheduledAppointments()

        res.status(200).json({
            success: true,
            data: appointmentsDB
        })

    } catch (error) {

        next(error)
    }
}

//Actualizar cita por el cliente
export const update = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validar el ID
        const idValidation = validateAppointmentId(id);
        if (!idValidation.success) {
            return res.status(400).json({
                success: false,
                message: 'ID de cita inválido',
                errors: idValidation.error.errors
            });
        }

        // Validar los datos de entrada
        const { success, data, error } = validateAppointmentUpdate(req.body);
        
        if (!success) {
            return res.status(400).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors: error.errors
            });
        }

        // Obtener información de la cita actual
        const query = `SELECT * FROM appointment WHERE appointment_id = ?`;
        const [existingResult] = await pool.query(query, [id]);

        if (existingResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'La cita no existe'
            });
        }

        const existingAppointment = existingResult[0];
        const oldServiceId = existingAppointment.service_id;
        const oldStatus = existingAppointment.status;

        // Si se está cambiando el servicio, verificar que el nuevo servicio existe y está disponible
        if (data.service_id && data.service_id !== oldServiceId) {
            const newServiceInfo = await getServiceInfo(data.service_id);
            
            if (!newServiceInfo) {
                return res.status(404).json({
                    success: false,
                    message: 'El nuevo servicio no existe'
                });
            }

            if (!newServiceInfo.available) {
                return res.status(400).json({
                    success: false,
                    message: 'El nuevo servicio no está disponible'
                });
            }

            // Cambiar disponibilidad: nuevo servicio a no disponible, anterior a disponible
            await cambiarDisponibilidad(data.service_id, 0);
            await cambiarDisponibilidad(oldServiceId, 1);
        }

        // Si se está actualizando fecha/hora, verificar duplicados y conflictos
        if (data.appointment_date || data.start_time) {
            const newDate = data.appointment_date || existingAppointment.appointment_date;
            const newStartTime = data.start_time || existingAppointment.start_time;
            const newUserId = existingAppointment.user_id;

            // Convertir user_id de binary a UUID para la verificación
            const userIdQuery = `SELECT BIN_TO_UUID(?) as user_uuid`;
            const [userIdResult] = await pool.query(userIdQuery, [newUserId]);
            const userUuid = userIdResult[0].user_uuid;

            // Verificar duplicados (excluyendo la cita actual)
            const isDuplicate = await checkDuplicateAppointment(userUuid, newDate, newStartTime, id);
            
            if (isDuplicate) {
                // Revertir cambios de disponibilidad si hubo error
                if (data.service_id && data.service_id !== oldServiceId) {
                    await cambiarDisponibilidad(data.service_id, 1);
                    await cambiarDisponibilidad(oldServiceId, 0);
                }
                
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe una cita para este usuario en la misma fecha y hora'
                });
            }

            // Verificar conflictos de horario
            const newEndTime = data.end_time || existingAppointment.end_time;
            const hasConflict = await checkTimeConflict(newDate, newStartTime, newEndTime, id);
            
            if (hasConflict) {
                // Revertir cambios de disponibilidad si hubo error
                if (data.service_id && data.service_id !== oldServiceId) {
                    await cambiarDisponibilidad(data.service_id, 1);
                    await cambiarDisponibilidad(oldServiceId, 0);
                }
                
                return res.status(409).json({
                    success: false,
                    message: 'El horario solicitado no está disponible, hay conflicto con otra cita'
                });
            }
        }

        // Si se está cambiando el estado de la cita
        if (data.status && data.status !== oldStatus) {
            const newStatus = data.status;
            const currentServiceId = data.service_id || oldServiceId;

            // Si la cita cambia de 'scheduled' a 'completed' o 'cancelled', liberar el servicio
            if (oldStatus === 'scheduled' && (newStatus === 'completed' || newStatus === 'cancelled')) {
                await cambiarDisponibilidad(currentServiceId, 1);
            }
            // Si la cita cambia de 'completed' o 'cancelled' a 'scheduled', reservar el servicio
            else if ((oldStatus === 'completed' || oldStatus === 'cancelled') && newStatus === 'scheduled') {
                // Verificar que el servicio esté disponible antes de reservarlo
                const serviceInfo = await getServiceInfo(currentServiceId);
                
                if (!serviceInfo.available) {
                    return res.status(400).json({
                        success: false,
                        message: 'No se puede programar la cita, el servicio no está disponible'
                    });
                }
                
                await cambiarDisponibilidad(currentServiceId, 0);
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
        console.error('Error en update appointment:', error);
        next(error);
    }
}
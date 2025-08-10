import {
    getAllAppointments,
    getUserAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    checkDuplicateAppointment,
    checkServiceTimeConflict,
    getServiceInfo,
    calculateEndTime,
    checkUserExists,
    getAppointmentById,
} from '../Models/citas.models.js'
import { validateAppointments, validateAppointmentUpdate, validateAppointmentId} from '../Schemas/citas.schema.js'
import { v4 as uuidv4 } from 'uuid';
import { createNotification } from '../Models/notificaciones.models.js';



//ver todas las citas agendadas por el cliente con paginacion
export const getAllScheduled = async (req, res, next) => {
    try {
        // Obtener parametros de paginacion y filtro de estado de query parameters
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const status = req.query.status; // scheduled, cancelled, completed
        
        // Validar parametros de paginacion
        if (page < 1) {
            const validationError = new Error('El número de página debe ser mayor a 0')
            validationError.status = 400
            return next(validationError)
        }
        
        if (limit < 1 || limit > 100) {
            const validationError = new Error('El límite debe estar entre 1 y 100')
            validationError.status = 400
            return next(validationError)
        }

        // Validar el status si se proporciona
        if (status && !['scheduled', 'cancelled', 'completed'].includes(status)) {
            const validationError = new Error('El estado debe ser: scheduled, cancelled o completed')
            validationError.status = 400
            return next(validationError)
        }

        // Si no se especifica status, mostrar todas las citas
        const result = await getAllAppointments(page, limit, status)

        // Verificar si no hay citas
        if (!result.data || result.data.length === 0) {
            return res.status(204).send()
        }

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination
        })

    } catch (error) {
        return next(error)
    }
}


//Consultar todas las citas del cliente con paginacion
export const getAll = async (req, res, next) => {
    try {
        // Obtener el ID del usuario del token JWT
        const userId = req.user.id
        
        // Obtener parametros de paginacion y filtro de estado de query parameters
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const status = req.query.status // scheduled, cancelled, completed
        
        // Validar parametros de paginacion
        if (page < 1) {
            const validationError = new Error('El número de página debe ser mayor a 0')
            validationError.status = 400
            return next(validationError)
        }
        
        if (limit < 1 || limit > 100) {
            const validationError = new Error('El límite debe estar entre 1 y 100')
            validationError.status = 400
            return next(validationError)
        }

        // Validar el status si se proporciona
        if (status && !['scheduled', 'cancelled', 'completed'].includes(status)) {
            const validationError = new Error('El estado debe ser: scheduled, cancelled o completed')
            validationError.status = 400
            return next(validationError)
        }

        // Verificar que el usuario existe
        const userExists = await checkUserExists(userId)
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: 'El usuario no existe'
            })
        }

        const result = await getUserAppointments(userId, page, limit, status)

        // Verificar si el usuario no tiene citas
        if (!result.data || result.data.length === 0) {
            return res.status(204).send();
        }

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });

    } catch (error) {
        return next(error);
    }
}

//Crear una cita 
export const create = async (req, res, next) => {
    try {
        // Obtener el ID del usuario del token JWT
        const userId = req.user.id
        const data = req.body

        // Validar los datos con Zod
        const { success, data: safeData, error } = validateAppointments(data);
        
        if (!success) {
            const validationError = new Error(error.message);
            validationError.status = 400;
            return next(validationError);
        }

        // Asignar el user_id del token (sobrescribir cualquier valor del body)
        safeData.user_id = userId;

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

        // Crear notificación automática de cita creada
        try {
            const formattedDate = formatDateForNotification(safeData.appointment_date);
            const formattedTime = formatTimeForNotification(safeData.start_time);
            
            await createNotification({
                notificationId: uuidv4(), // Generar ID para la notificación
                userId: safeData.user_id,
                appointmentId: appointmentId,
                type: 'cita_creada',
                title: 'Cita Programada',
                message: `Su cita de ${serviceInfo.name} ha sido programada exitosamente para el ${formattedDate} a las ${formattedTime}.`
            });
        } catch (notificationError) {
            console.error('Error al crear notificación:', notificationError);
        }

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

        // Obtener información de la cita antes de eliminarla para la notificación
        const appointmentInfo = await getAppointmentById(id);
        
        if (!appointmentInfo) {
            return res.status(404).json({
                success: false,
                message: 'Cita no encontrada'
            });
        }

        const result = await deleteAppointment(id)

        // Crear notificación automática de cita cancelada
        try {
            const formattedDate = formatDateForNotification(appointmentInfo.appointment_date);
            const formattedTime = formatTimeForNotification(appointmentInfo.start_time);
            
            await createNotification({
                notificationId: uuidv4(), // Generar ID para la notificación
                userId: appointmentInfo.user_id,
                appointmentId: id,
                type: 'cita_cancelada',
                title: 'Cita Cancelada',
                message: `Su cita programada para el ${formattedDate} a las ${formattedTime} ha sido cancelada.`
            });
        } catch (notificationError) {
            console.error('Error al crear notificación de cancelación:', notificationError);
            // No afectar el flujo principal si falla la notificación
        }

        res.status(200).json({
            success: true,
            message: 'Cita eliminada correctamente',
            data:{
                Id: id,
            }
        });

    } catch (error) {
        return next(error)
    }
}



//Actualizar cita
export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Obtener el ID del usuario del token JWT
        const userId = req.user.id;

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

        // Verificar que la cita pertenece al usuario autenticado
        if (existingAppointment.user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para modificar esta cita'
            });
        }

        // Asegurar que el user_id no se pueda cambiar desde el body
        if (data.user_id) {
            delete data.user_id; // Eliminar user_id del body si viene
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




// Helper para formatear fecha para notificaciones
const formatDateForNotification = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Helper para formatear hora para notificaciones
const formatTimeForNotification = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};
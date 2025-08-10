import {
    getUserNotifications,
    createNotification,
    markAsRead,
    deleteNotification,
    checkUserExists
} from '../Models/notificaciones.models.js';
import {
    validateCreateNotification,
    validateNotificationId
} from '../Schemas/notificaciones.schema.js';
import {v4 as uuidv4} from 'uuid'


// Obtener notificaciones del usuario autenticado
export const getNotifications = async (req, res, next) => {
    try {
        // Obtener el ID del usuario del token JWT
        const userId = req.user.id
        const isRead = req.query.is_read !== undefined ? 
            req.query.is_read === 'true' ? 1 : 0 : null

        // Verificar si el usuario existe
        const userExists = await checkUserExists(userId);
        if (!userExists) {
            const error = new Error('Usuario no encontrado');
            error.status = 404;
            return next(error);
        }

        const notifications = await getUserNotifications(userId, isRead);

        // Verificar si el usuario no tiene citas
        if (!notifications || notifications.length === 0) {
            return res.status(204).send();
        }

        res.status(200).json({
            success: true,
            message: 'Notificaciones obtenidas exitosamente',
            ...notifications
        });

    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        error.status = error.status || 500;
        next(error);
    }
}

// Crear nueva notificación
export const createNewNotification = async (req, res, next) => {
    try {
        // Obtener el ID del usuario del token JWT
        const userId = req.user.id;
        
        // Validar datos de entrada
        const validation = validateCreateNotification(req.body);
        if (!validation.success) {
            const error = new Error('Datos de notificación inválidos');
            error.status = 400;
            error.details = validation.error.errors;
            return next(error);
        }

        // Verificar si el usuario existe
        const userExists = await checkUserExists(userId);
        if (!userExists) {
            const error = new Error('Usuario no encontrado');
            error.status = 404;
            return next(error);
        }
        
        // Crear ID de notificación
        const notificationId = uuidv4();

        await createNotification({
            notificationId: notificationId,
            userId: userId, // Usar user_id del token
            appointmentId: req.body.appointment_id,
            type: req.body.type,
            title: req.body.title,
            message: req.body.message
        });

        res.status(201).json({
            success: true,
            message: 'Notificación creada exitosamente',
            data: { notification_id: notificationId }
        });

    } catch (error) {
        console.error('Error al crear notificación:', error);
        error.status = error.status || 500;
        next(error);
    }
};

// Marcar notificación como leída
export const markNotificationAsRead = async (req, res, next) => {
    try {
        // Obtener el ID del usuario del token JWT
        const userId = req.user.id;
        const { notificationId } = req.params;

        // Validar notificationId
        const notificationIdValidation = validateNotificationId(notificationId);

        if (!notificationIdValidation.success) {
            const error = new Error('ID de notificación inválido');
            error.status = 400;
            return next(error);
        }

        const success = await markAsRead(notificationId, userId);
        
        if (!success) {
            const error = new Error('Notificación no encontrada o no pertenece al usuario');
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            success: true,
            message: 'Notificación marcada como leída'
        });

    } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
        error.status = error.status || 500;
        next(error);
    }
};


// Eliminar notificación
export const removeNotification = async (req, res, next) => {
    try {
        // Obtener el ID del usuario del token JWT
        const userId = req.user.id;
        const { notificationId } = req.params;

        // Validar notificationId
        const notificationIdValidation = validateNotificationId(notificationId);

        if (!notificationIdValidation.success) {
            const error = new Error('ID de notificación inválido');
            error.status = 400;
            return next(error);
        }

        const success = await deleteNotification(notificationId, userId);
        
        if (!success) {
            const error = new Error('Notificación no encontrada o no pertenece al usuario');
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            success: true,
            message: 'Notificación eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar notificación:', error);
        error.status = error.status || 500;
        next(error);
    }
};


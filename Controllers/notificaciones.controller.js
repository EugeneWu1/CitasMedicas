import {
    getUserNotifications,
    createNotification,
    markAsRead,
    deleteNotification,
    checkUserExists
} from '../Models/notificaciones.models.js';
import {
    validateCreateNotification,
    validateUserId,
    validateNotificationId
} from '../Schemas/notificaciones.schema.js';

// Obtener notificaciones del usuario
export const getNotifications = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const isRead = req.query.is_read !== undefined ? 
            req.query.is_read === 'true' ? 1 : 0 : null;

        // Validar userId
        const userIdValidation = validateUserId(userId);
        if (!userIdValidation.success) {
            const error = new Error('ID de usuario inválido');
            error.status = 400;
            return next(error);
        }

        // Validar parámetros de paginación
        if (page < 1) {
            const error = new Error('El número de página debe ser mayor a 0');
            error.status = 400;
            return next(error);
        }

        if (limit < 1 || limit > 50) {
            const error = new Error('El límite debe estar entre 1 y 50');
            error.status = 400;
            return next(error);
        }

        // Verificar si el usuario existe
        const userExists = await checkUserExists(userId);
        if (!userExists) {
            const error = new Error('Usuario no encontrado');
            error.status = 404;
            return next(error);
        }

        const notifications = await getUserNotifications(userId, page, limit, isRead);

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
};

// Crear nueva notificación
export const createNewNotification = async (req, res, next) => {
    try {
        // Validar datos de entrada
        const validation = validateCreateNotification(req.body);
        if (!validation.success) {
            const error = new Error('Datos de notificación inválidos');
            error.status = 400;
            error.details = validation.error.errors;
            return next(error);
        }

        // Verificar si el usuario existe
        const userExists = await checkUserExists(req.body.user_id);
        if (!userExists) {
            const error = new Error('Usuario no encontrado');
            error.status = 404;
            return next(error);
        }

        const notificationId = await createNotification({
            userId: req.body.user_id,
            appointmentId: req.body.appointment_id,
            type: req.body.type,
            title: req.body.title,
            message: req.body.message,
            priority: req.body.priority || 'medium',
            scheduledFor: req.body.scheduled_for
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
        const { userId, notificationId } = req.params;

        // Validar IDs
        const userIdValidation = validateUserId(userId);
        const notificationIdValidation = validateNotificationId(notificationId);

        if (!userIdValidation.success || !notificationIdValidation.success) {
            const error = new Error('ID inválido');
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
        const { userId, notificationId } = req.params;

        // Validar IDs
        const userIdValidation = validateUserId(userId);
        const notificationIdValidation = validateNotificationId(notificationId);

        if (!userIdValidation.success || !notificationIdValidation.success) {
            const error = new Error('ID inválido');
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


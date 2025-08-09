import { Router } from 'express';
import { verifyToken } from '../middlewares/isAuth.js';
import {
    getNotifications,
    createNewNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    getUnreadNotificationsCount
} from '../Controllers/notificaciones.controller.js';

const notificationRouter = Router();

// Obtener conteo de notificaciones no leídas - DEBE IR ANTES DE /:userId
notificationRouter.get('/:userId/unread-count', verifyToken, getUnreadNotificationsCount);

// Marcar todas las notificaciones como leídas - DEBE IR ANTES DE /:userId
notificationRouter.put('/:userId/mark-all-read', verifyToken, markAllNotificationsAsRead);

// Obtener notificaciones del usuario (con paginación y filtros)
notificationRouter.get('/:userId', verifyToken, getNotifications);

// Crear nueva notificación
notificationRouter.post('/', verifyToken, createNewNotification);

// Marcar notificación específica como leída
notificationRouter.put('/:userId/:notificationId/read', verifyToken, markNotificationAsRead);

// Eliminar notificación específica
notificationRouter.delete('/:userId/:notificationId', verifyToken, removeNotification);

export default notificationRouter;
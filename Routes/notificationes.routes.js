import { Router } from 'express';

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Endpoints para gestión de notificaciones de usuario
 */
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

/**
 * @swagger
 * /notificaciones/{userId}/unread-count:
 *   get:
 *     summary: Obtener conteo de notificaciones no leídas
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *         example: "25d23db5-92a8-4b4b-aca8-3db01a06041b"
 *     responses:
 *       200:
 *         description: Conteo de notificaciones no leídas
 *       401:
 *         description: Token inválido
 */
// Obtener conteo de notificaciones no leídas - DEBE IR ANTES DE /:userId
notificationRouter.get('/:userId/unread-count', verifyToken, getUnreadNotificationsCount);

/**
 * @swagger
 * /notificaciones/{userId}/mark-all-read:
 *   put:
 *     summary: Marcar todas las notificaciones como leídas
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *         example: "25d23db5-92a8-4b4b-aca8-3db01a06041b"
 *     responses:
 *       200:
 *         description: Todas las notificaciones marcadas como leídas
 *       401:
 *         description: Token inválido
 */
// Marcar todas las notificaciones como leídas - DEBE IR ANTES DE /:userId
notificationRouter.put('/:userId/mark-all-read', verifyToken, markAllNotificationsAsRead);

/**
 * @swagger
 * /notificaciones/{userId}:
 *   get:
 *     summary: Listar notificaciones del usuario autenticado
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *         example: "25d23db5-92a8-4b4b-aca8-3db01a06041b"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de elementos por página
 *         example: 10
 *       - in: query
 *         name: is_read
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado de lectura
 *         example: false
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *       401:
 *         description: Token inválido
 */
// Obtener notificaciones del usuario (con paginación y filtros)
notificationRouter.get('/:userId', verifyToken, getNotifications);

/**
 * @swagger
 * /notificaciones:
 *   post:
 *     summary: Crear nueva notificación
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - type
 *               - title
 *               - message
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "25d23db5-92a8-4b4b-aca8-3db01a06041b"
 *               appointment_id:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               type:
 *                 type: string
 *                 enum: [appointment_reminder, appointment_created, appointment_cancelled]
 *                 example: "appointment_reminder"
 *               title:
 *                 type: string
 *                 example: "Recordatorio de Cita"
 *               message:
 *                 type: string
 *                 example: "Su cita está programada para mañana a las 10:00 AM. Por favor confirme su asistencia."
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: "medium"
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token inválido
 */
// Crear nueva notificación
notificationRouter.post('/', verifyToken, createNewNotification);

/**
 * @swagger
 * /notificaciones/{userId}/{notificationId}/read:
 *   put:
 *     summary: Marcar notificación específica como leída
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *         example: "25d23db5-92a8-4b4b-aca8-3db01a06041b"
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la notificación
 *         example: "123e4567-e89b-12d3-a456-426614174001"
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 *       401:
 *         description: Token inválido
 *       404:
 *         description: Notificación no encontrada
 */
// Marcar notificación específica como leída
notificationRouter.put('/:userId/:notificationId/read', verifyToken, markNotificationAsRead);

/**
 * @swagger
 * /notificaciones/{userId}/{notificationId}:
 *   delete:
 *     summary: Eliminar notificación específica
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *         example: "25d23db5-92a8-4b4b-aca8-3db01a06041b"
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la notificación
 *         example: "123e4567-e89b-12d3-a456-426614174001"
 *     responses:
 *       200:
 *         description: Notificación eliminada exitosamente
 *       401:
 *         description: Token inválido
 *       404:
 *         description: Notificación no encontrada
 */
// Eliminar notificación específica
notificationRouter.delete('/:userId/:notificationId', verifyToken, removeNotification);

export default notificationRouter;
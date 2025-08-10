import { Router } from 'express';
import { verifyToken } from '../middlewares/isAuth.js';
import {
    getNotifications,
    createNewNotification,
    markNotificationAsRead,
    removeNotification,
} from '../Controllers/notificaciones.controller.js';

const notificationRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Endpoints para gestión de notificaciones de usuario
 */

/**
 * @swagger
 * /notificaciones:
 *   get:
 *     summary: Obtener notificaciones del usuario autenticado
 *     description: Permite a un usuario ver sus propias notificaciones con filtro opcional por estado de lectura
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: is_read
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado de lectura (true/false, opcional)
 *     responses:
 *       200:
 *         description: Notificaciones obtenidas exitosamente
 *       204:
 *         description: No hay notificaciones para mostrar
 *       401:
 *         description: Token no válido
 *       404:
 *         description: Usuario no encontrado
 */
// Obtener notificaciones del usuario autenticado
notificationRouter.get('/', verifyToken, getNotifications);

/**
 * @swagger
 * /notificaciones:
 *   post:
 *     summary: Crear nueva notificación
 *     description: Crear una nueva notificación para el usuario autenticado
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
 *               - message
 *               - title
 *               - type
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Su cita ha sido creada exitosamente"
 *                 description: Mensaje de la notificación
 *               title:
 *                 type: string
 *                 example: "Cita Creada"
 *                 description: Título de la notificación
 *               type:
 *                 type: string
 *                 example: "cita_creada"
 *                 enum: [cita_creada, cita_cancelada, recordatorio, sistema]
 *                 description: Tipo de notificación (cita_creada, cita_cancelada, recordatorio, sistema)
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no válido
 */
// Crear nueva notificación
notificationRouter.post('/', verifyToken, createNewNotification);

/**
 * @swagger
 * /notificaciones/{notificationId}/read:
 *   put:
 *     summary: Marcar notificación como leída
 *     description: Marca una notificación específica del usuario autenticado como leída
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación marcada como leída exitosamente
 *       400:
 *         description: ID de notificación inválido
 *       401:
 *         description: Token no válido
 *       404:
 *         description: Notificación no encontrada o no pertenece al usuario
 */
// Marcar notificación específica como leída
notificationRouter.put('/:notificationId/read', verifyToken, markNotificationAsRead);

/**
 * @swagger
 * /notificaciones/{notificationId}:
 *   delete:
 *     summary: Eliminar notificación
 *     description: Elimina una notificación específica del usuario autenticado
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación eliminada exitosamente
 *       400:
 *         description: ID de notificación inválido
 *       401:
 *         description: Token no válido
 *       404:
 *         description: Notificación no encontrada o no pertenece al usuario
 */
// Eliminar notificación específica
notificationRouter.delete('/:notificationId', verifyToken, removeNotification);

export default notificationRouter;
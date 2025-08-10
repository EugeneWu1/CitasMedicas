import {Router} from 'express'
import{ isAdmin } from '../middlewares/isAdmin.js'
import {verifyToken} from '../middlewares/isAuth.js'

/**
 * @swagger
 * tags:
 *   name: Citas
 *   description: Endpoints para gestión de citas médicas
 */
import {
    getAll,
    create,
    remove,
    getAllScheduled,
    update,
    getAllCancelled,
    getAllCompleted,
    getAvailableSlots
} from '../Controllers/citas.controller.js'

const appointmentRouter = Router()

/**
 * @swagger
 * /citas/admin/scheduled:
 *   get:
 *     summary: Ver todas las citas agendadas (Solo admin)
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         example: 20
 *     responses:
 *       200:
 *         description: Lista de citas agendadas
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado - Solo administradores
 */
//Ver todas las citas agendadas por el cliente (admin) - DEBE IR ANTES DE /:id
appointmentRouter.get('/admin/scheduled', [verifyToken, isAdmin], getAllScheduled)

/**
 * @swagger
 * /citas/admin/cancelled:
 *   get:
 *     summary: Ver todas las citas canceladas (Solo admin)
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         example: 15
 *     responses:
 *       200:
 *         description: Lista de citas canceladas
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado - Solo administradores
 */
//Obtener todas las citas canceladas (admin) - DEBE IR ANTES DE /:id
appointmentRouter.get('/admin/cancelled', [verifyToken, isAdmin], getAllCancelled)

/**
 * @swagger
 * /citas/admin/completed:
 *   get:
 *     summary: Ver todas las citas completadas (Solo admin)
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         example: 25
 *     responses:
 *       200:
 *         description: Lista de citas completadas
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado - Solo administradores
 */
//Obtener todas las citas completadas (admin) - DEBE IR ANTES DE /:id
appointmentRouter.get('/admin/completed', [verifyToken, isAdmin], getAllCompleted)

//Obtener horarios disponibles - DEBE IR ANTES DE /:id
/**
 * @swagger
 * /citas/availableSlots:
 *   get:
 *     summary: Consultar horarios disponibles para un servicio en una fecha
 *     tags: [Citas]
 *     parameters:
 *       - in: query
 *         name: service_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del servicio
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha a consultar (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Horarios disponibles
 */
appointmentRouter.get('/availableSlots', verifyToken, getAvailableSlots)

/**
 * @swagger
 * /citas/{id}:
 *   get:
 *     summary: Consultar todas las citas de un usuario
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *         example: "0949fb0f-1b68-4069-ad98-e4a7de6636f9"
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
 *         example: 5
 *     responses:
 *       200:
 *         description: Lista de citas del usuario
 *       401:
 *         description: Token inválido
 *       404:
 *         description: Usuario no encontrado
 *   put:
 *     summary: Actualizar una cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita
 *         example: "4060428a-0e2f-4ae3-8de1-e67992d7ac39"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "13891c48-358f-47e0-974c-d79559bf0fd9"
 *               service_id:
 *                 type: string
 *                 example: "db4c169c-31a0-446b-8fc0-3e49732c8a07"
 *               appointment_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-16"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: "11:00:00"
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 example: "completed"
 *               notes:
 *                 type: string
 *                 example: "Cambio de fecha solicitado por el paciente"
 *     responses:
 *       200:
 *         description: Cita actualizada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token inválido
 *       404:
 *         description: Cita no encontrada
 *   delete:
 *     summary: Eliminar una cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita
 *         example: "1765488c-950a-4aa8-9af9-619651177459"
 *     responses:
 *       200:
 *         description: Cita eliminada exitosamente
 *       401:
 *         description: Token inválido
 *       404:
 *         description: Cita no encontrada
 */
//Consultar todas las citas del cliente
appointmentRouter.get('/:id',verifyToken, getAll)

/**
 * @swagger
 * /citas:
 *   post:
 *     summary: Crear una nueva cita
 *     tags: [Citas]
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
 *               - service_id
 *               - appointment_date
 *               - start_time
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "13891c48-358f-47e0-974c-d79559bf0fd9"
 *               service_id:
 *                 type: string
 *                 example: "db4c169c-31a0-446b-8fc0-3e49732c8a07"
 *               appointment_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-15"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: "09:30:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: "14:30:00"
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 example: "scheduled"
 *               notes:
 *                 type: string
 *                 example: "Primera consulta"
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token inválido
 *       409:
 *         description: Conflicto de horario
 */
//Crear una cita por el cliente 
appointmentRouter.post('/',verifyToken,create)

//Actualizar cita por el cliente
appointmentRouter.put('/:id',verifyToken, update)

//Borrar una cita por el cliente
appointmentRouter.delete('/:id',verifyToken, remove)

export default appointmentRouter
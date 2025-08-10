import {Router} from 'express'
import{ isAdmin } from '../middlewares/isAdmin.js'
import {verifyToken} from '../middlewares/isAuth.js'
import {
    getAll,
    create,
    remove,
    getAllScheduled,
    update,
} from '../Controllers/citas.controller.js'

const appointmentRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Citas
 *   description: Endpoints para gestión de citas médicas
 */

/**
 * @swagger
 * /api/citas/admin/citas:
 *   get:
 *     summary: Obtener todas las citas (Admin)
 *     description: Permite a los administradores ver todas las citas del sistema con filtros opcionales por estado
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de citas por página
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, cancelled, completed]
 *         description: Filtrar por estado de cita (opcional, si no se proporciona muestra todas)
 *     responses:
 *       200:
 *         description: Lista de citas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no válido
 *       403:
 *         description: No tiene permisos de administrador
 *       500:
 *         description: Error interno del servidor
 */
//Ver todas las citas en general (admin) 
appointmentRouter.get('/admin/citas', [verifyToken, isAdmin], getAllScheduled)


/**
 * @swagger
 * /api/citas:
 *   get:
 *     summary: Obtener citas del usuario autenticado
 *     description: Permite a un usuario ver sus propias citas con filtros opcionales por estado
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de citas por página
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, cancelled, completed]
 *         description: Filtrar por estado de cita (opcional, si no se proporciona muestra todas)
 *     responses:
 *       200:
 *         description: Lista de citas del usuario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no válido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
//Consultar todas las citas del cliente autenticado
appointmentRouter.get('/', verifyToken, getAll)

/**
 * @swagger
 * /api/citas:
 *   post:
 *     summary: Crear una nueva cita
 *     description: Permite a un usuario autenticado crear una nueva cita. El user_id se extrae automáticamente del token JWT.
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
 *               - service_id
 *               - appointment_date
 *               - start_time
 *             properties:
 *               service_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID del servicio médico
 *                 example: "db4c169c-31a0-446b-8fc0-3e49732c8a07"
 *               appointment_date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la cita (YYYY-MM-DD)
 *                 example: "2025-08-15"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: Hora de inicio (HH:MM:SS)
 *                 example: "09:30:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: Hora de fin (opcional, se calcula automáticamente)
 *                 example: "10:00:00"
 *               notes:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Notas adicionales (opcional)
 *                 example: "Primera consulta"
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no válido
 *       404:
 *         description: Usuario o servicio no encontrado
 *       409:
 *         description: Conflicto de horario o cita duplicada
 */
//Crear una cita
appointmentRouter.post('/',verifyToken,create)

/**
 * @swagger
 * /api/citas/{id}:
 *   put:
 *     summary: Actualizar una cita existente
 *     description: Permite a un usuario actualizar su propia cita. El user_id se verifica automáticamente con el token JWT.
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la cita a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID del servicio médico
 *               appointment_date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la cita (YYYY-MM-DD)
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: Hora de inicio (HH:MM:SS)
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: Hora de fin
 *               status:
 *                 type: string
 *                 enum: [scheduled, cancelled, completed]
 *                 description: Estado de la cita
 *               notes:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Notas adicionales
 *     responses:
 *       200:
 *         description: Cita actualizada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no válido
 *       403:
 *         description: No tiene permisos para modificar esta cita
 *       404:
 *         description: Cita no encontrada
 *       409:
 *         description: Conflicto de horario
 */
//Actualizar cita
appointmentRouter.put('/:id',verifyToken, update)

//Borrar una cita
appointmentRouter.delete('/:id',verifyToken, remove)

export default appointmentRouter
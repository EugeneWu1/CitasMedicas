import {Router} from 'express'
import{ isAdmin } from '../middlewares/isAdmin.js'
import {verifyToken} from '../middlewares/isAuth.js'
import {
    getAll, availableService,createService, updateService,changeAvailability ,deleteService
} from '../Controllers/servicios.controller.js'

const serviceRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Endpoints para gestión de servicios médicos
 */

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Listar todos los servicios médicos
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios
 */
//Consultar todos los servicios
serviceRouter.get('/',getAll)


/**
 * @swagger
 * /servicios:
 *   post:
 *     summary: Crear un nuevo servicio (Solo admin)
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - duration
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Consulta General"
 *               description:
 *                 type: string
 *                 example: "Servicio de consulta medica general"
 *               duration:
 *                 type: integer
 *                 example: 30
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 500.00
 *               available:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado - Solo administradores
 */
//Crear un servicio
serviceRouter.post('/',[verifyToken,isAdmin],createService)

/**
 * @swagger
 * /servicios/disponibilidad:
 *   get:
 *     summary: Listar servicios por disponibilidad
 *     tags: [Servicios]
 *     parameters:
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filtrar por disponibilidad
 *         example: true
 *     responses:
 *       200:
 *         description: Lista de servicios filtrados por disponibilidad
 */
//Consultar por disponibilidad
serviceRouter.get('/disponibilidad',availableService)

/**
 * @swagger
 * /servicios/{id}:
 *   put:
 *     summary: Actualizar un servicio (Solo admin)
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "3fc60f19-7e09-4255-8804-4f2f0967259a"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Examen de Laboratorio"
 *               description:
 *                 type: string
 *                 example: "Análisis de sangre y orina con interpretación médica"
 *               duration:
 *                 type: integer
 *                 example: 20
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 1200.00
 *               available:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Servicio actualizado exitosamente
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado - Solo administradores
 *       404:
 *         description: Servicio no encontrado
 */
//Actualizar servicio
serviceRouter.put('/:id',[verifyToken,isAdmin],updateService)

/**
 * @swagger
 * /servicios/{id}/disponibilidad:
 *   put:
 *     summary: Cambiar disponibilidad de un servicio (Solo admin)
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "db4c169c-31a0-446b-8fc0-3e49732c8a07"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - available
 *             properties:
 *               available:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Disponibilidad actualizada exitosamente
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado - Solo administradores
 *       404:
 *         description: Servicio no encontrado
 */
//Actualizar disponibilidad
serviceRouter.put('/:id/disponibilidad',[verifyToken,isAdmin], changeAvailability)

/**
 * @swagger
 * /servicios/{id}:
 *  delete:
 *      summary: Eliminar un servicio (Solo admin)
 *      tags: [Servicios]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          example: "614bb6a9-59f0-410e-a373-754f847123a0"
 *      responses:
 *        200:
 *          description: Servicio eliminado exitosamente
 *        401:
 *          description: Token inválido
 *        403:
 *          description: Acceso denegado - Solo administradores
 *        404:
 *          description: Servicio no encontrado
 */
//Borrar un servicio
serviceRouter.delete('/:id',[verifyToken,isAdmin],deleteService)


export default serviceRouter
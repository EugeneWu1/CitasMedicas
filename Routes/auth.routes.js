import {Router} from 'express';
import {
    createUser,
    login,
    setPassword,
    getUsers,
    getByRole
} from '../Controllers/auth.controller.js'
import {verifyToken} from '../middlewares/isAuth.js'
import {isAdmin} from '../middlewares/isAdmin.js'

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación y usuarios
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jodoe@gmail.com"
 *               phone:
 *                 type: string
 *                 example: "33333333"
 *               role:
 *                 type: string
 *                 enum: [admin, client]
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario creado correctamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "1389c148-358f-47e0-974c-d79559bf0fd9"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "jodoe@gmail.com"
 *                     phone:
 *                       type: string
 *                       example: "33333333"
 *       400:
 *         description: Error de validación en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error en los datos de entrada"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         example: "invalid_type"
 *                       expected:
 *                         type: string
 *                         example: "string"
 *                       received:
 *                         type: string
 *                         example: "undefined"
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["email"]
 *                       message:
 *                         type: string
 *                         example: "Required"
 *       409:
 *         description: El email ya está registrado en el sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "El email ya está registrado en el sistema"
 *       500:
 *         description: Error interno del servidor (email, base de datos, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error al crear usuario"
 */
userRouter.post('/register',createUser)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - password
 *             properties:
 *               user:
 *                 type: string
 *                 format: email
 *                 example: "example@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso - Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario autenticado correctamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     name:
 *                       type: string
 *                       example: "Erick Mendoza"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       206:
 *         description: Debe cambiar contraseña - Token temporal generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Debe cambiar su contraseña, su token temporal es válido por 1 hora"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     mustChangePassword:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Datos de entrada inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Faltan campos requeridos: user, password"
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuario o contraseña incorrectos"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
userRouter.post('/login' ,login )

/**
 * @swagger
 * /auth/set-password:
 *   patch:
 *     summary: Actualizar contraseña del usuario (requiere token temporal)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - new_password
 *               - confirm_password
 *             properties:
 *               old_password:
 *                 type: string
 *                 description: Contraseña temporal actual
 *                 example: "-jyl}2nzQa5P"
 *               new_password:
 *                 type: string
 *                 description: Nueva contraseña deseada
 *                 example: "ErickMendez123#"
 *               confirm_password:
 *                 type: string
 *                 description: Confirmación de la nueva contraseña
 *                 example: "ErickMendez123#"
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contraseña actualizada correctamente"
 *       400:
 *         description: Error de validación en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "Las contraseñas nuevas no coinciden"
 *                 - type: object
 *                   properties:
 *                     issues:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           code:
 *                             type: string
 *                             example: "too_small"
 *                           minimum:
 *                             type: number
 *                             example: 8
 *                           type:
 *                             type: string
 *                             example: "string"
 *                           inclusive:
 *                             type: boolean
 *                             example: true
 *                           exact:
 *                             type: boolean
 *                             example: false
 *                           message:
 *                             type: string
 *                             example: "String must contain at least 8 character(s)"
 *                           path:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["new_password"]
 *       401:
 *         description: Errores de autenticación
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "Token de autorización requerido"
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "Token no válido para cambio de contraseña"
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "La contraseña anterior no es correcta"
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "El token para cambiar contraseña ha expirado"
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "Token inválido"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor al cambiar la contraseña"
 */
userRouter.patch('/set-password',setPassword)

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Obtener todos los usuarios del sistema
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuarios obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuarios obtenidos correctamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "1389c148-358f-47e0-974c-d79559bf0fd9"
 *                       name:
 *                         type: string
 *                         example: "Erick Mendoza"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "emendeza@unah.hn"
 *                       phone:
 *                         type: string
 *                         example: "33333333"
 *                       role:
 *                         type: string
 *                         enum: [admin, client]
 *                         example: "admin"
 *                       must_change_password:
 *                         type: integer
 *                         example: 0
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-08T21:12:03.000Z"
 *                 total:
 *                   type: integer
 *                   example: 5
 *       204:
 *         description: No hay usuarios registrados en el sistema
 *       401:
 *         description: Token de autenticación requerido o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token de acceso requerido"
 *       403:
 *         description: Acceso denegado - Solo administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Acceso denegado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
userRouter.get('/users', [verifyToken, isAdmin], getUsers)

/**
 * @swagger
 * /auth/users/{role}:
 *   get:
 *     summary: Obtener usuarios filtrados por rol
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [admin, client]
 *         description: Filtrar usuarios por rol
 *         example: "client"
 *     responses:
 *       200:
 *         description: Usuarios filtrados por rol obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuarios con rol client obtenidos correctamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "1389c148-358f-47e0-974c-d79559bf0fd9"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "jdoe@gmail.com"
 *                       phone:
 *                         type: string
 *                         example: "33333333"
 *                       role:
 *                         type: string
 *                         example: "client"
 *                       must_change_password:
 *                         type: integer
 *                         example: 0
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-08T21:12:03.000Z"
 *                 total:
 *                   type: integer
 *                   example: 3
 *       204:
 *         description: No hay usuarios con el rol especificado
 *       400:
 *         description: Errores de validación del parámetro role
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "El parámetro role es requerido"
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "El role debe ser client o admin"
 *       401:
 *         description: Token de autenticación requerido o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token de acceso requerido"
 *       403:
 *         description: Acceso denegado - Solo administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Acceso denegado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error al obtener usuarios por rol"
 */
userRouter.get('/users/:role', [verifyToken, isAdmin], getByRole)

export default userRouter;
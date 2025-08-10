import {Router} from 'express';
import {

    createUser,
    login,
    setPassword,
    getUsers,
    getByRole

}from '../Controllers/auth.controller.js'
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
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error de validación
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
 *                 example: "emendeza@unah.hn"
 *               password:
 *                 type: string
 *                 example: "ErickMendez123#"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Credenciales inválidas
 */
userRouter.post('/login' ,login )

/**
 * @swagger
 * /auth/set-password:
 *   patch:
 *     summary: Actualizar contraseña del usuario
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
 *                 example: "-jyl}2nzQa5P"
 *               new_password:
 *                 type: string
 *                 example: "ErickMendez123#"
 *               confirm_password:
 *                 type: string
 *                 example: "ErickMendez123#"
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token inválido o contraseña actual incorrecta
 */
userRouter.patch('/set-password',setPassword)

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Listar todos los usuarios (Solo admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado - Solo administradores
 */
userRouter.get('/users', [verifyToken, isAdmin], getUsers)

/**
 * @swagger
 * /auth/users/{role}:
 *   get:
 *     summary: Listar usuarios por rol (Solo admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [admin, client]
 *         example: "client"
 *     responses:
 *       200:
 *         description: Lista de usuarios filtrados por rol
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado - Solo administradores
 */
userRouter.get('/users/:role', [verifyToken, isAdmin], getByRole)

export default userRouter;
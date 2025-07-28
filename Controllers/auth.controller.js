import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import {register, loginUser, updatePasswordUser}from '../Models/auth.models.js';
import {Resend} from 'resend';
import { createAccountEmailHTML } from '../emailTemplate.js';
import {authSchemaData, authSchemaUpdateData} from '../Schemas/auth.schema.js';
import generatePassword from 'generate-password';


export const login = async(req, res) => {
    try {
        //user es el email del usuario 
        const { user, password } = req.body

        //valida la info en la base de datos
        const data = await loginUser(user)
        console.log(data)

        //validacion usuario y contraseña con datos obtenidos de la base de datos
        if (!await bcrypt.compare(password, data.password_hash)) {
            res.status(401).json({
                success: false, 
                message: 'Usuario o contraseña incorrectos'
            })
            return
        }

        //validar si el usuario debe cambiar la contraseña
        if (data.must_change_password) {
            const tokenTemporal = jwt.sign({
                id: data.id,
                password_hash: data.password_hash, // Cambié 'password' por 'password_hash'
                mustChangePassword: true
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            })

            res.json({
                success: true,
                message: 'Debe cambiar su contraseña, su token temporal es válido por 1 hora',
                data: {
                    token: tokenTemporal,
                    mustChangePassword: true
                }
            })
            return
        }

        //en este punto si el usuario es correcto y no debe cambiar la contraseña
        const payload = {
            id: data.id,
            role: data.role,
        }

        //generar el token de acceso
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            algorithm: 'HS256', 
            expiresIn: '12h'
        })

        delete data.password_hash 

        res.json({
            success: true,
            message: 'Usuario autenticado correctamente',
            data: data,
            token
        })
    } catch (error) {
        console.error('Error en login:', error)
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        })
    }
}

export const createClient = async (req, res) => {
    try {
        //const { name: nameReq, email: emailReq, phone: phoneReq, role: roleReq } = req.body

        const createSafe = authSchemaData(req.body)

        if(createSafe.success ===false){
            return res.status(400).json({
                success: false,
                message: 'Error en los datos de entrada',
                errors: createSafe.error.issues
            })
        }

        const { name, email, phone, role } = createSafe.data

        const id = uuidv4()

        //generar una contraseña temporal
        const tempPassword = generatePassword.generate({
                length: 12,
                numbers: true,
                uppercase: true,
                lowercase: true,
                symbols: true,
                strict: true
        })
        //const tempPassword = '1234@newClient'; 
        const password_hash = await bcrypt.hash(tempPassword, 10)

        const result = await register([id, name, email, phone, role, password_hash])

        //enviar a correo 
        const resend = new Resend(process.env.RESEND_API_KEY)

        await resend.emails.send({
            from: 'noreply@emewesdev.com',
            to: email,
            subject: 'Creación de cuenta',
            html: createAccountEmailHTML(tempPassword) 
        });

        res.json({
            success: true,
            message: 'Usuario creado correctamente',
            data: {id, name, email, phone}
        })
    } catch (error) {
        console.error('Error en createClient:', error)
        res.status(400).json({
            success: false,
            message: 'Error al crear el usuario',
            error: error.message
        })
    }
}

export const setPassword = async (req, res) => {
    try {
        const { authorization } = req.headers
        
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token de autorización requerido'
            })
        }

        const token = authorization.split(' ')[1]
        const { old_password, new_password, confirm_password } = req.body

        console.log('Token recibido:', token)
        console.log('JWT_SECRET:', process.env.JWT_SECRET)

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('Token decodificado:', decoded)

        const { id, password_hash, mustChangePassword } = decoded

        // Verificar que el token es para cambio de contraseña
        if (!mustChangePassword) {
            return res.status(401).json({
                success: false,
                message: 'Token no válido para cambio de contraseña'
            })
        }

        // Verificar la contraseña anterior
        if (!await bcrypt.compare(old_password, password_hash)) {
            return res.status(401).json({
                success: false,
                message: 'La contraseña anterior no es correcta'
            })
        }

        // Validar que las contraseñas nuevas coincidan
        if (new_password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: 'Las contraseñas nuevas no coinciden'
            })
        }

       /// const updatePasswordSafe = authSchemaUpdateData({ old_password, new_password, confirm_password })
       //TODO: APLICAR EL SCHEMA DE VALIDACION 
    

        const newPasswordHash = await bcrypt.hash(new_password, 10)
        console.log('Nueva contraseña hasheada:', newPasswordHash)

        await updatePasswordUser(id, newPasswordHash)

        res.json({
            success: true,
            message: 'Contraseña actualizada correctamente'
        })

    } catch (error) {
        console.error('Error en setPassword:', error)
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'El token para cambiar contraseña ha expirado'
            })
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            })
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al cambiar la contraseña'
        })
    }
}
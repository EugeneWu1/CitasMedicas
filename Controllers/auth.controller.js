
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import {register}from '../Models/auth.models.js';



export const login = async(req, res) => {
    // Lógica para registrar un usuario
    //const {user, password} = req.body 
    

    /// aqui por que primero se tiene que crear usuario 
}

export const createClient = async (req, res) => {

    const { name, email, phone, role } = req.body

    const id = uuidv4()

    //generar un hash de contraseña temporal
    const password_hash = await bcrypt.hash('1234', 10)

    try {
        const result = await register([id, name, email, phone, role, password_hash])


        res.json({
            success: true,
            message: 'Usuario creado correctamente',
            data: {id,name,email,phone}
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            success: false,
            message: 'Error al crear el usuario',
            error: error.message
        })
    }
}
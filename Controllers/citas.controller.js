import {
    getAllAppointmentsFromUser,
    createAppointment,
    deleteAppointment,
    getAllScheduledAppointments,
    updateAppointment
} from '../Models/citas.models.js'
import { v4 as uuidv4 } from 'uuid';  


//Consultar todas las citas del cliente
export const getAll = async (req, res, next) => {
    try {
        const { id } = req.params

        const appointmentsDB = await getAllAppointmentsFromUser(id)

        res.status(200).json({
            success: true,
            data: appointmentsDB
        })

    } catch (error) {
        // Manejo de errores
        next(error)
    }
}

//Crear una cita por el cliente
export const create = async (req, res,) => {

}

//Borrar una cita por el cliente
export const remove = async (req, res, next) => {

    const { id } = req.params

    try {

        const result = await deleteAppointment(id)

        res.status(200).json({
            success: true,
            message: 'Cita eliminada correctamente',
            data: result
        })

    } catch (error) {

        next(error)
    }
}

//ver todas las citas agendadas por el cliente
export const getAllScheduled = async (req, res, next) => {
    try {
        const appointmentsDB = await getAllScheduledAppointments()

        res.status(200).json({
            success: true,
            data: appointmentsDB
        })

    } catch (error) {
        
        next(error)
    }
}

//Actualizar cita por el cliente
export const update = async (req, res) => {
}
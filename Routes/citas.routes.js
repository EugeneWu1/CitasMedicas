import {Router} from 'express'
import{ isAdmin } from '../middlewares/isAdmin.js'
import {verifyToken} from '../middlewares/isAuth.js'

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

//Ver todas las citas agendadas por el cliente (admin) - DEBE IR ANTES DE /:id
appointmentRouter.get('/admin/scheduled', [verifyToken, isAdmin], getAllScheduled)

//Obtener todas las citas canceladas (admin) - DEBE IR ANTES DE /:id
appointmentRouter.get('/admin/cancelled', [verifyToken, isAdmin], getAllCancelled)

//Obtener todas las citas completadas (admin) - DEBE IR ANTES DE /:id
appointmentRouter.get('/admin/completed', [verifyToken, isAdmin], getAllCompleted)

//Obtener horarios disponibles - DEBE IR ANTES DE /:id
appointmentRouter.get('/availableSlots', verifyToken, getAvailableSlots)

//Consultar todas las citas del cliente
appointmentRouter.get('/:id',verifyToken, getAll)

//Crear una cita por el cliente 
appointmentRouter.post('/',verifyToken,create)

//Actualizar cita por el cliente
appointmentRouter.put('/:id',verifyToken, update)

//Borrar una cita por el cliente
appointmentRouter.delete('/:id',verifyToken, remove)

export default appointmentRouter
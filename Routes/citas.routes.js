import {Router} from 'express'
import{ isAdmin } from '../middlewares/isAdmin.js'
import {verifyToken} from '../middlewares/isAuth.js'

import {
    getAll,
    create,
    remove,
    getAllScheduled,
    update
} from '../Controllers/citas.controller.js'

const appointmentRouter = Router()

//Consultar todas las citas del cliente
appointmentRouter.get('/:id',verifyToken, getAll)

//Crear una cita por el cliente 
appointmentRouter.post('/',verifyToken,create)

//Borrar una cita por el cliente
appointmentRouter.delete('/:id',verifyToken, remove)

//Ver todas las citas agendadas por el cliente
appointmentRouter.get('/admin', [verifyToken, isAdmin], getAllScheduled)

//Actualizar cita por el cliente
appointmentRouter.put('/:id',verifyToken, update)

export default appointmentRouter
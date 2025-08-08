import {Router} from 'express'
import{ isAdmin } from '../middlewares/isAdmin.js'
import {verifyToken} from '../middlewares/isAuth.js'


import {
    getAll, availableService,createService, updateService,changeAvailability ,deleteService
} from '../Controllers/servicios.controller.js'

const serviceRouter = Router()

//Consultar todos los servicios
serviceRouter.get('/',getAll)

//Crear un servicio
serviceRouter.post('/',[verifyToken,isAdmin],createService)

//Actualizar servicio
serviceRouter.put('/:id',[verifyToken,isAdmin],updateService)

//Borrar un servicio
serviceRouter.delete('/:id',[verifyToken,isAdmin],deleteService)

//Consultar por disponibilidad
serviceRouter.get('/disponibilidad',availableService)

//Actualizar disponibilidad
serviceRouter.put('/:id/disponibilidad',[verifyToken,isAdmin], changeAvailability)


export default serviceRouter
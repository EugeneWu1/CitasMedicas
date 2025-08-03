import {Router} from 'express'
import{ isAdmin } from '../middlewares/isAdmin.js'
import {isAuth} from '../middlewares/isAuth.js'


import {
    getAll, availableService,createService, updateService,changeAvailability ,deleteService
} from '../Controllers/servicios.controller.js'

const serviceRouter = Router()

//Consultar todos los servicios
serviceRouter.get('/',(req,res) => {
    getAll(req,res)
})

//Consultar por disponibilidad
serviceRouter.get('/disponibilidad',availableService)

//Crear un servicio
serviceRouter.post('/',[isAuth,isAdmin],createService)

//Actualizar servicio
serviceRouter.put('/:id',[isAuth,isAdmin],updateService)

//Actualizar disponibilidad
serviceRouter.put('/:id/disponibilidad',[isAuth,isAdmin], changeAvailability)

//Borrar un servicio
serviceRouter.delete('/:id',[isAuth,isAdmin],deleteService)

export default serviceRouter
//TODO: Agregar isAuth update y delete
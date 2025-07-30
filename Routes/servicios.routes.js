import {Router} from 'express'
import{ isAdmin } from '../middlewares/isAdmin.js'


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
serviceRouter.post('/',isAdmin,createService)

//Actualizar servicio
serviceRouter.put('/:id',isAdmin,updateService)

//Actualizar disponibilidad
serviceRouter.put('/:id/disponibilidad',isAdmin, changeAvailability)

//Borrar un servicio
serviceRouter.delete('/:id',isAdmin,deleteService)

export default serviceRouter
//TODO: Agregar isAuth update y delete
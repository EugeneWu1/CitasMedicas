import {Router} from 'express'
//import{isAuth} from '../middleewares/isAuth.js'

import {
    getAll, availableService,createService, updateService,changeAvailability ,deleteService
} from '../Controllers/servicios.controller.js'

const serviceRouter = Router()

//Consultar todos los servicios
serviceRouter.get('/',(req,res) => {
    getAll(req,res)
})

//Consultar por disponibilidad
serviceRouter.get('/available',availableService)

//Crear un servicio
serviceRouter.post('/',createService)

//Actualizar servicio
serviceRouter.patch('/:id',updateService)

//Actualizar disponibilidad
serviceRouter.patch('/:id/available', changeAvailability)

//Borrar un servicio
serviceRouter.delete('/:id',deleteService)

//TODO: Agregar isAuth update y delete
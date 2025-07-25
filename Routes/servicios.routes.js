import {Router} from 'express'
//import{isAuth} from '../middleewares/isAuth.js'

import {
    getAll, createService, updateService, deleteService
} from '../Controllers/servicios.controller.js'

const serviceRouter = Router()

//Consultar todos los servicios
serviceRouter.get('/',(req,res) => {
    getAll(req,res)
})

//Crear un servicio
serviceRouter.post('/',createService)

//Actualizar servicio
serviceRouter.patch('/:id',updateService)

//Borrar un servicio
serviceRouter.delete('/:id',deleteService)

//TODO: Agregar isAuth update y delete
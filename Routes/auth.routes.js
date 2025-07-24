import {Router} from 'express';
import {

    RegisterUser,
    LoginUser
}from '../Controllers/auth.controller.js'

const datingRouter = Router();

//Rutas de Autenticacion
datingRouter.post('/register',RegisterUser)
datingRouter.post('/login' ,LoginUser )



export default datingRouter;
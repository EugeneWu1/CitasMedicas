import {Router} from 'express';
import {

    createClient,
    login,
    
}from '../Controllers/auth.controller.js'

const userRouter = Router();

//Rutas de Autenticacion
userRouter.post('/register',createClient)
userRouter.post('/login' ,login )

//datingRouter.patch('/set-password',setPassword)



export default userRouter;
import {Router} from 'express';
import {

    createClient,
    login,
    setPassword
    
}from '../Controllers/auth.controller.js'

const userRouter = Router();

//Rutas de Autenticacion
userRouter.post('/register',createClient)
userRouter.post('/login' ,login )
userRouter.patch('/set-password',setPassword)


export default userRouter;
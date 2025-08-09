import {Router} from 'express';
import {

    createClient,
    login,
    setPassword,
    getUsers,
    getByRole

}from '../Controllers/auth.controller.js'
import {verifyToken} from '../middlewares/isAuth.js'
import {isAdmin} from '../middlewares/isAdmin.js'

const userRouter = Router();

//Rutas de Autenticacion
userRouter.post('/register',createClient)
userRouter.post('/login' ,login )
userRouter.patch('/set-password',setPassword)
userRouter.get('/users', [verifyToken, isAdmin], getUsers)
userRouter.get('/users/:role', [verifyToken, isAdmin], getByRole)

export default userRouter;
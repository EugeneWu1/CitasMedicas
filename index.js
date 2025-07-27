import express from 'express'
import userRouter from './Routes/auth.routes.js';
import serviceRouter from './Routes/servicios.routes.js'
import dotenv from 'dotenv'
import helmet from "helmet";
import { rateLimit } from 'express-rate-limit'
import cors from 'cors'

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 50,
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
})

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
dotenv.config()
app.use(helmet());
app.use(limiter)

app.use(cors({
    // configuración de los origenes permitidos
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'https://prod.server.com',
        'https://test.server.com'
    ],
    // metodos permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // encabezados permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'Bearer', 'api-key']
}))

//Rutas
app.use('/api/auth',userRouter)


//servicios
app.use('/servicios',serviceRouter)


//Ruta por defecto
app.use((req,res)=> {
   res.status(404).json(
      {
         message: `${req.url} no encontrada`
      }
   )
})

app.listen(PORT, () => {
   console.log(`El servidor esta corriendo en el puerto http://localhost:${PORT}`)
})
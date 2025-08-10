import express from 'express'
import setupSwagger from './swagger.js';
import userRouter from './Routes/auth.routes.js';
import serviceRouter from './Routes/servicios.routes.js'
import appointmentRouter from './Routes/citas.routes.js';
import notificationRouter from './Routes/notificationes.routes.js';
import dotenv from 'dotenv'
import helmet from "helmet";
import { rateLimit } from 'express-rate-limit'
import cors from 'cors'
import errorHandler from './middlewares/errorHandler.js'
import { notFoundHandler } from './middlewares/asyncHandler.js'

// Configurar dotenv ANTES de usar variables de entorno
dotenv.config()

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

// Middlewares globales
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(helmet());
app.use(limiter)

app.use(cors({
    // configuración de los origenes permitidos
    origin: [
        'http://localhost:3000',
        'http://localhost:4200',
        'https://emewesdev.com/',
        'https://prod.server.com',
        'https://test.server.com'
    ],
    // metodos permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // encabezados permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'Bearer', 'api-key']
}))


// Integrar Swagger UI en /api-docs
setupSwagger(app);

//Router principal
const apiRouter = express.Router()

// Ruta principal con el prefijo /api
app.use('/api', apiRouter)

//Rutas de la aplicación
apiRouter.use('/auth',userRouter)
apiRouter.use('/servicios',serviceRouter)
apiRouter.use('/citas',appointmentRouter)
apiRouter.use('/notificaciones',notificationRouter)


// Middleware para rutas no encontradas
app.use(notFoundHandler);

// Middleware para manejar errores - DEBE IR AL FINAL
app.use(errorHandler)

app.listen(PORT, () => {
   console.log(`El servidor esta corriendo en el puerto http://localhost:${PORT}`)
})
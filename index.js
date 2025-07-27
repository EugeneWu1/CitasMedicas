import express from 'express'
import userRouter from './Routes/auth.routes.js';
import serviceRouter from './Routes/servicios.routes.js'
import dotenv from 'dotenv'

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
dotenv.config()


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
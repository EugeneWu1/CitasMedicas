import express from 'express'
import userRouter from './Routes/auth.routes.js';
import serviceRouter from './Routes/servicios.routes.js'

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())


//Rutas
app.use('/api/auth',userRouter)

app.use('/servicios',serviceRouter)
//Auth

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
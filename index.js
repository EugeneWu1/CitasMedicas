import express from 'express'
import datingRouter from './Routes/auth.routes.js';

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())


//Rutas
app.use('/api/auth',datingRouter)
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
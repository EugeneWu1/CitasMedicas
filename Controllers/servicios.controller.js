import {validateServices, validateServiceUpdate, validateAvailability, validateServiceId} from '../Schemas/servicios.schema.js'
import {getAllServicios,getServiciosPorDisponibilidad,cambiarDisponibilidad,insertServicio,updateServicio,deleteServicio} from '../Models/servicios.models.js'
import {v4 as uuidv4} from 'uuid'

//Muestra todos los servicios disponibles en la clinica
export const getAll = async (req,res,next) => {
    try {
        //Obtener los datos del modelo de base de datos
        const servicesDB = await getAllServicios()

        //Si fue exitoso que muestre la informacion
        res.status(200).json({
            success: true,
            data: servicesDB
        })
    } catch (error) {
        //Si hubo un error que muestre un error
        next(error)
    }
}

//Muestra los servicios disponibles: true
export const availableService = async (req,res,next) => {
    try {
        
        //Obtenemos del query especificamente lo que buscamos mostrar
        const disponible = req.query.available === 'true'

        //Obtenemos del modelo la informacion solicitada
        const results = await getServiciosPorDisponibilidad(disponible)

        //Si tuvo exito mostrar los datos
        res.status(200).json({
            success: true,
            data: results
        })
    } catch (error) {
        //Si hubo error mostrar un mensaje de error
        next(error)
    }
}

//Funcion para crear un servicio
export const createService = async(req,res,next) => {
    //Extraemos del body que nos mandan del api.http los parametros que se van a ingresar a la base de datos
    const data = req.body

    //Validamos con zod los datos que vienen en el body
    const {success, error, data: safeData} = validateServices(data)

    //Si los datos no cumplen con los requisitos de zod
    if(!success){
        const validationError = new Error(error.message);
        validationError.status = 400;
        return next(validationError); 
    }

    //Codificar el id
    const id = uuidv4()

    //De la data filtrada por zod que la id con uuid sea la nueva id que se va a almacenar
    safeData.id = id

   
    try {
        //Una vez filtrada toda la informacion le pasamos a la funcion del modelo lo que vamos a insertar
        const response = await insertServicio(safeData)

        //Si tuvo exito mostrar mensaje de exito con el codigo de creacion exitosa
        res.status(201).json({
            success: true,
            data: response
        })

    } catch (error) {
        //Si los datos no cumplen con los requisitos de zod
        return next(error)
    }
}

//Funcion para actualizar la informacion existente
export const updateService = async (req,res,next) => {

    //Obtenemos el id del servicio que vamos a modificar
    const {id} = req.params

    // Validar el ID
    const idValidation = validateServiceId(id);
    if (!idValidation.success) {
        const validationError = new Error(idValidation.error.message);
        validationError.status = 400;
        return next(validationError);
    }

    //Validamos con zod que el body cumpla con los requisitos esperados
    const dataValidada = validateServiceUpdate(req.body)

    //Si no cumple con los requisitos de zod lanzamos un mensaje de error
    if(!dataValidada.success){
        const validationError = new Error('Datos inválidos.');
        validationError.status = 400;
        return next(validationError);
    }

    //Si la data es valida por zod guardarla en la nueva variable que se mandara a la base de datos
    const dataFiltrada = dataValidada.data

    try {
        //Utilizamos el modelo para actualizar informacion de un servicio y le pasamos dos parametros: id del servicio y la dataFiltrada por zod
        const result = await updateServicio(id,dataFiltrada)

        //Si la operacion fue exitosa mostrar la data actualizada
        res.status(200).json({
            success: true,
            data: result
        })

    } catch (error) {
        //Si no se actualizo lanzamos un mensaje de error por parte del servidor
        return next(error);
    }
}

//Funcion para cambiar el estado de la disponibilidad de un servicio
export const changeAvailability = async (req,res,next) => {
    //Obtenemos el id del servicio que vamos a modificar
    const {id} = req.params

    // Validar el ID
    const idValidation = validateServiceId(id);
    if (!idValidation.success) {
        const validationError = new Error(idValidation.error.message);
        validationError.status = 400;
        return next(validationError);
    }

    //Validamos con zod que el body cumpla con los requisitos esperados
    const validacion = validateAvailability(req.body)

    //Si no cumple con los requisitos de zod lanzamos un mensaje de error    
    if(!validacion.success){
        const error = new Error('Datos inválidos para disponibilidad');
        error.status = 400;
        error.details = validacion.error.errors;
        return next(error);
    }

    //Del body desestructuramos la data que viene filtrada por zod
    const {disponible} = validacion.data

    try {
    //Utilizamos el modelo para actualizar el estado del servicio, los cuales recibe dos parametros: id del servicio y el nuevo estado
    const result = await cambiarDisponibilidad(id, disponible)

    //Si los cambios fueron exitosos mostrar el campo actualizado
    res.status(200).json({
      success: true,
      message: 'Disponibilidad actualizada correctamente',
      data: result
    })
  } catch (error) {
    //Si fallo mandamos un mensaje de error por parte del servidor
    return next(error)
  }
}

//Funcion parra borrar un servicio 
export const deleteService = async (req,res,next) => {
    //Obtenemos el id del servicio a borrar
    const {id} = req.params

    try {

        //Utilizamos el modelo para borrar el servicio que recibe como parametro el id del servicio
        const result = await deleteServicio(id)

        //Si tuvo exito mandamos mensaje de exito 
        res.status(200).json({
            success: true,
            message: 'Servicio eliminado correctamente',
            data: result
        })
        
    } catch (error) {
        //Si falla mandamos mensaje de error con codigo de estado para el lado del servidor
        return next(error)
    }
} 
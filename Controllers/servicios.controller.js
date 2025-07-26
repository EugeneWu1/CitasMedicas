import {validateServices, validateServiceUpdate, validateAvailability} from '../Schemas/servicios.schema.js'
import {getAllServicios,getServiciosPorDisponibilidad,cambiarDisponibilidad,insertServicio,updateServicio,deleteServicio} from '../Models/servicios.models.js'
import {v4 as uuidv4} from 'uuid'

export const getAll = async (req,res) => {
    try {
        const servicesDB = await getAllServicios()

        res.status(200).json({
            success: true,
            data: servicesDB
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message: 'Error al obtener servicios',
            error: error.message
        })
    }
}

export const availableService = async (req,res) => {
    try {
        const disponible = req.query.available === 'true'

        const results = await getServiciosPorDisponibilidad(disponible)

        res.status(200).json({
            success: true,
            data: results
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al consultar servicios disponibles',
            error: error.message
        })
    }
}

export const createService = async(req,res) => {
    const data = req.body

    const {success, error, data: safeData} = validateServices(data)

    if(!success){
        res.status(400).json({
            success: false,
            message: 'Error al crear servicio.',
            error: error.message
        })
    }

    //Codificar el id
    const id = uuidv4()
    safeData.id = id

   
    try {
        const response = await insertServicio(safeData)

        res.status(201).json({
            success: true,
            data: response
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al insertar servicio.',
            error: error.message
        })
    }
}

export const updateService = async (req,res) => {
    const {id} = req.params

    const dataValidada = validateServiceUpdate(req.body)

    if(!dataValidada.success){
        return res.status(400).json({
            success: false,
            message: 'Datos invalidos.',
            error: error.message
        })
    }

    const dataFiltrada = dataValidada.data

    try {
        const result = await updateServicio(id,dataFiltrada)
        res.json(result)

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar servicio.',
            error: error.message
        })
    }
}

export const changeAvailability = async (req,res) => {
    const {id} = req.params

    const validacion = validateAvailability(req.body)

    if(!validacion.success){
        return res.status(400).json({
        success: false,
        message: 'Datos inválidos para disponibilidad',
        errors: validacion.error.errors
        })
    }

    const {disponible} = validacion.data

    try {
    const result = await cambiarDisponibilidad(id, disponible)
    res.json({
      success: true,
      message: 'Disponibilidad actualizada correctamente',
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar disponibilidad',
      error: error.message
    })
  }
}

export const deleteService = async (req,res) => {
    const {id} = req.params

    res.json({
      success: true,
      message: 'Servicio eliminado correctamente',
      data: result
    });

    try {
        const result = await deleteServicio(id)

        res.json({
            success: true,
            message: 'Servicio eliminado correctamente',
            data: result
        })
        
    } catch (error) {
        res.status(500).json({
        success: false,
        message: 'Error al eliminar servicio',
        error: error.message
        });
    }
} 
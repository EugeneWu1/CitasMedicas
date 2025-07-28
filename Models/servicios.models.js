import pool from '../Config/db.js';


//Funcion para listar todos los servicios
export const getAllServicios = async() => {

   const query = `SELECT s.service_id,s.name,s.description,s.duration,s.price,s.available
                FROM service s`


   //Mandar el query a la base de datos
   const [results] = await pool.query(query)

   //Retornar los datos encontrados por el query
   return results
}

//Funcion para mostrar servicios por disponibilidad: true
export const getServiciosPorDisponibilidad = async (available) => {
  const query = `SELECT service_id, name, description, duration, price, available
                 FROM service
                 WHERE available = ?`;

  //Mandamos a ejecutar el query con dos parametros el query y la varible condicional para filtrar la data
  const [results] = await pool.query(query, [available]);

  //Retornar los datos encontrados
  return results;
};

//Funcion para cambiar la disponibilidad de true a false o viceversa
export const cambiarDisponibilidad = async (id, disponible) => {

   //Obtenemos la conexion a la base de datos
  const conn = await pool.getConnection();

  //Utilizamos un try catch para manejar trransacciones de base de datos de manera mas segura
  try {
   //Comenzamos la transaccion
    await conn.beginTransaction();

    const query = `UPDATE service SET available = ? WHERE service_id = ?`;

    //Le pasamos el query con dos parametros: el query y una lista
    const [result] = await conn.execute(query, [disponible, id]);

    //Hacemos el commit de la transaccion
    await conn.commit();

    return {
      success: result.affectedRows > 0, //Si se actualizo mostramos success = true
      message: result.affectedRows > 0 ? 'Disponibilidad actualizada correctamente' : 'Servicio no encontrado', // Si success es trrue mostramos mensaje de exito si no, no se encontro el servicio 
    };
  } catch (error) {
   //Revertimos cambios hechos por el commit
    await conn.rollback();
    //Lanzamos error
    throw error;
  } finally {
    //Cerramos la conexion con la base de datos
    conn.release();
  }
}

//Funcion para insertar un nuevo servicio a la base de datos
export const insertServicio = async(services) => {
   //Obtenemos la conexion a la base de datos
   const conn = await pool.getConnection()

   try {
      //Comenzamos la transaccion
      conn.beginTransaction()

      //Parametros que obtenemos del body y son requeridos para poder crear un nuevo servicio
      const { id, nombre, descripcion,duracion,precio,disponible } = services

      const query = `INSERT INTO service (service_id, name, description, duration, price,available) VALUES (?, ?, ?, ?, ?,?)`

      //Ejecutamos la instruccion y le pasamos los parametros esperados 
      await conn.execute(query,[id, nombre, descripcion,duracion,precio,disponible])

      //Hacemos el commit de la transaccion
      await conn.commit()

      //Retornamos un objeto con la informacion con los campos del servicio creados
      return services
   } catch (error) {
      //Revertimos cambios hechos por el commit
      conn.rollback()
      throw error
   } finally {
      //Cerramos la conexion con la base de datos
      conn.release()
   }
}

export const updateServicio = async(id,services) => {
   //Obtenemos la conexion a la base de datos
   const conn = await pool.getConnection()

   try {
      //Comenzamos la transaccion
      await conn.beginTransaction()

      //Parametros que obtenemos del body y son requeridos para poder crear un nuevo servicio
      const { nombre,descripcion,duracion,precio,disponible} = services

      const query = `UPDATE service SET name = ?, description =?, duration = ?,
                        price = ?, available = ? WHERE service_id = ?`


      //Ejecutamos la instruccion y le pasamos los parametros esperados
      const [result] = await conn.execute(query, [nombre,descripcion,duracion,precio,disponible,id])

      //Hacemos el commit de la transaccion
      await conn.commit()

      //Retornamos un objeto con la informacion con los campos del servicio creados
      return {
         success: true,
         message: 'Servicio actualizado correctamente',
         data: services,
         affectedRows: result.affectedRows
      }

   } catch (error) {
      //Revertimos cambios hechos por el commit
      await conn.rollback()
      throw error
   }finally{
      //Cerramos la conexion con la base de datos
      conn.release()
   }
}

//Funcion para eliminar un servicio de la base de datos
export const deleteServicio = async(id) => {
   //Obtenemos la conexion a la base de datos
   const conn = await pool.getConnection()

   try {
      //Comenzamos la transaccion
      await conn.beginTransaction()

      const query = `DELETE FROM service WHERE service_id = ?`

      //Ejecutamos la instruccion y le pasamos los parametros esperados
      const [result] = await conn.execute(query,[id])

      //Hacemos el commit de la transaccion
      await conn.commit()

      //Retornamos un mensaje de exito si se logro eliminar el servicio
      return {
         success: result.affectedRows > 0,
         message: result.affectedRows > 0 ? 'Servicio eliminado correctamente' : 'Servicio no encontrado',
      }
   } catch (error) {
      //Revertimos cambios hechos por el commit
      await conn.rollback();
      throw error;
   } finally {
      //Cerramos la conexion con la base de datos
      conn.release();
  }
}
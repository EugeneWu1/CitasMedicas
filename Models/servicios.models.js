import pool from '../Config/db.js';

//getAllServicios,insertServicio,updateServicio,deleteServicio

export const getAllServicios = async() => {
 const query = `SELECT s.service_id,s.name,s.description,s.duration,s.price,s.available
                FROM service s`

   const [results] = await pool.query(query)
   return results
}

export const getServiciosPorDisponibilidad = async (available) => {
  const query = `SELECT service_id, name, description, duration, price, available
                 FROM service
                 WHERE available = ?`;
  const [results] = await pool.query(query, [available]);
  return results;
};

export const cambiarDisponibilidad = async (id, disponible) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const query = `UPDATE service SET available = ? WHERE service_id = ?`;

    const [result] = await conn.execute(query, [disponible, id]);

    await conn.commit();

    return {
      success: result.affectedRows > 0,
      message: result.affectedRows > 0 ? 'Disponibilidad actualizada correctamente' : 'Servicio no encontrado',
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export const insertServicio = async(services) => {
   const conn = await pool.getConnection()

   try {
      conn.beginTransaction()

      const { id, nombre, descripcion,duracion,precio,disponible } = services

      const query = `INSERT INTO service (service_id, name, description, duration, price,available) VALUES (?, ?, ?, ?, ?,?)`

      await conn.execute(query,[id, nombre, descripcion,duracion,precio,disponible])

      await conn.commit()

      return services
   } catch (error) {
      conn.rollback()
      throw error
   } finally {
      conn.release()
   }
}

export const updateServicio = async(id,services) => {
   const conn = await pool.getConnection()

   try {
      await conn.beginTransaction()

      const query = `UPDATE service SET name = ?, description =?, duration = ?,
                        price = ?, available = ? WHERE service_id = ?`

      const { nombre,descripcion,duracion,precio,disponible} = services

      const [result] = await conn.execute(query, [nombre,descripcion,duracion,precio,disponible,id])

      await conn.commit()

      return {
         success: true,
         message: 'Servicio actualizado correctamente',
         data: services,
         affectedRows: result.affectedRows
      }

   } catch (error) {
      await conn.rollback()
      throw error
   }finally{
      conn.release()
   }
}

export const deleteServicio = async(id) => {
   const conn = await pool.getConnection()

   try {
      await conn.beginTransaction()

      const query = `DELETE FROM service WHERE service_id = ?`

      const [result] = await conn.execute(query,[id])
      await conn.commit()

      return {
         success: result.affectedRows > 0,
         message: result.affectedRows > 0 ? 'Servicio eliminado correctamente' : 'Servicio no encontrado',
      }
   } catch (error) {
      await conn.rollback();
      throw error;
   } finally {
      conn.release();
  }
}
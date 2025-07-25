import { message } from 'telegram/client';
import pool from '../database/db.js';

//getAllServicios,insertServicio,updateServicio,deleteServicio

export const getAllServicios = async() => {
 const query = `SELECT s.id,s.nombre,s.descripcion,s.precio,s.disponible
                FROM servicios s`

   const [results] = await pool.query(query)
   return results
}

export const insertServicio = async(services) => {
   const conn = await pool.getConnection()

   try {
      conn.beginTransaction()

      const { id, nombre, descripcion,precio,disponible } = services

      const query = `INSERT INTO servicios (id, nombre, descripcion, precio, disponible) VALUES (?, ?, ?, ?, ?)`

      await conn.execute(query,[id, nombre, descripcion,precio,disponible])

      conn.commit()

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

      const query = `UPDATE servicios SET nombre = ?, descripcion =?,
                        precio = ?, disponible = ? WHERE id = ?`

      const { nombre,descripcion,precio,disponible} = services

      const [result] = await conn.execute(query, [nombre,descripcion,precio,disponible,id])

      await conn.commit()

      return {
         success: true,
         message: 'Servicio actualizado correctamente',
         data: services,
         affectedRows: result.affectedRows
      }

   } catch (error) {
      conn.rollback()
      throw error
   }finally{
      conn.release()
   }
}

export const deleteServicio = async() => {
   
}
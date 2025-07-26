import pool from '../Config/db.js';


export const LoginUser = async(user) =>{

    
   /*  const query = 'Select BIN_TO_UUID(client_id) as id,name,email,phone,password_hash,role, must_chan from client where email = ?';
    const [results] = await pool.query(query, [user]);
    return results[0] */

}


export const register = async (user) => {

    const query = `INSERT INTO users (user_id, name, email, phone, role, password_hash, must_change_password) 
                    VALUES ( UUID_TO_BIN(?), ?, ?, ?, ?, ?, 1)`

    const [rows] = await pool.query(query, [...user])

    return rows

}
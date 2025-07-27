import pool from '../Config/db.js';


export const loginUser = async(user) =>{


    const query = 'Select BIN_TO_UUID(user_id) as id ,name,email,phone,password_hash,role,must_change_password from users where email = ?';
    const [results] = await pool.query(query, [user]);
     return results[0]
  

}


export const register = async (user) => {

    const query = `INSERT INTO users (user_id, name, email, phone, role, password_hash, must_change_password) 
                    VALUES ( UUID_TO_BIN(?), ?, ?, ?, ?, ?, 1)`

    const [rows] = await pool.query(query, [...user])

    return rows

}

export const updatePasswordUser = async (id, password_hash) =>{

    const query  = `UPDATE users SET users.password_hash = ?, must_change_password = 0 WHERE users.user_id = UUID_TO_BIN(?)`
    const [rows] = await pool.query(query, [password_hash, id])

    return rows

}

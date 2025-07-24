export const RegisterUser = (req, res) => {
    // Lógica para registrar un usuario
    res.status(201).json({ message: "Usuario registrado exitosamente" });
}

export const LoginUser = (req, res) => {
    // Lógica para iniciar sesión
    res.status(200).json({ message: "Inicio de sesión exitoso" });
}

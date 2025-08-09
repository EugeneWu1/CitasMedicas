### 🚀 API REST DE CITAS MÉDICAS

## Propósito
Esta API REST permite gestionar la reservación de citas médicas en una clínica. Proporciona endpoints para la administración de usuarios, servicios médicos, citas y notificaciones, facilitando la programación, actualización y cancelación de citas, así como la consulta de servicios disponibles y la gestión de notificaciones para los usuarios y administradores.

## ¿De qué trata?
El sistema está diseñado para clínicas que desean digitalizar el proceso de reservación de citas, permitiendo a los pacientes agendar, modificar o cancelar citas, y a los administradores gestionar servicios y disponibilidad. Incluye autenticación, control de roles y validaciones robustas.

## 👥 Integrantes
- **Erick Ronaldo Mendez Alvarado**  
  Número de cuenta: 20212021200  
  GitHub: [ErickRonaldo7](https://github.com/ErickRonaldo7)
- **Eugene Kelly Wu Leiva**  
  Número de cuenta: 20212030388  
  GitHub: [EugeneWu1](https://github.com/EugeneWu1)
- **Evelyn Andrea Sabillon Limas**  
  Número de cuenta: 20212000317  
  GitHub: [EvelynSabillon](https://github.com/EvelynSabillon)

## 🧾 Instrucciones
- Clone el repositorio.
```bash
   git clone https://github.com/EugeneWu1/CitasMedicas.git
```
- En tu editor de código de preferencia abre el proyecto desde su ubicación.
- En la terminal, ejecuta el siguiente comando:
```bash
 npm install express
```

- Para ejecutar la API desde tu terminal ejecuta:
```bash
 npm run dev
```

## 📦 Dependencias
```bash
npm install zod cors mysql2 dotenv jsonwebtoken
```

## 📚 Documentación de la API

### Autenticación
- **POST /api/auth/login**: Iniciar sesión y obtener token JWT.
- **POST /api/auth/register**: Registrar un nuevo usuario.

### Servicios Médicos
- **GET /api/servicios/**: Listar todos los servicios.
- **GET /api/servicios/disponibilidad?available=true|false**: Listar servicios por disponibilidad.
- **POST /api/servicios/**: Crear un nuevo servicio (admin).
- **PUT /api/servicios/:id**: Actualizar un servicio (admin).
- **PUT /api/servicios/:id/disponibilidad**: Cambiar disponibilidad (admin).
- **DELETE /api/servicios/:id**: Eliminar un servicio (admin).

### Citas Médicas
- **GET /api/citas/:id**: Consultar todas las citas de un usuario.
- **POST /api/citas/**: Crear una cita (usuario autenticado).
- **DELETE /api/citas/:id**: Eliminar una cita (usuario autenticado).
- **PUT /api/citas/:id**: Actualizar una cita (usuario autenticado).
- **GET /api/citas/admin/scheduled**: Ver todas las citas agendadas (admin).
- **GET /api/citas/admin/cancelled**: Ver todas las citas canceladas (admin).
- **GET /api/citas/admin/completed**: Ver todas las citas completadas (admin).
- **GET /api/citas/availableSlots?service_id=...&date=YYYY-MM-DD**: Consultar horarios disponibles para un servicio en una fecha.

### Notificaciones
- **GET /api/notificaciones/**: Listar notificaciones del usuario autenticado.

### Seguridad y Roles
- Los endpoints marcados como (admin) requieren autenticación y rol de administrador.
- El resto requiere autenticación mediante JWT.

### Respuestas de ejemplo
Las respuestas siguen el formato:
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { /* datos */ }
}
```
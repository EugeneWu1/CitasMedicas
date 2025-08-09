# 🏥 API REST DE CITAS MÉDICAS 🩺

## **Diseño Digital (IS-711) - 1500**  
**II PAC 2025**  

---

## 👥 **Integrantes del Grupo** 

1. **Erick Ronaldo Méndez Alvarado** (*20212021200*)  
   - GitHub: [ErickRonaldo7](https://github.com/ErickRonaldo7)  

2. **Eugene Kelly Wu Leiva** (*20212030388*)  
   - GitHub: [EugeneWu1](https://github.com/EugeneWu1)


3. **Evelyn Andrea Sabillón Limas** (*20212000317*)  
   - GitHub: [EvelynSabillon](https://github.com/EvelynSabillon)  

---

## ⭐ **Propósito**
Esta API REST permite gestionar la reservación de citas médicas en una clínica. Proporciona endpoints para la administración de usuarios, servicios médicos, citas y notificaciones, facilitando la programación, actualización y cancelación de citas, así como la consulta de servicios disponibles y la gestión de notificaciones para los usuarios y administradores.

## ❔ **¿De qué trata?**
El sistema está diseñado para clínicas que desean digitalizar el proceso de reservación de citas, permitiendo a los pacientes agendar, modificar o cancelar citas, y a los administradores gestionar servicios y disponibilidad. Incluye autenticación, control de roles y validaciones robustas.

---

## ⚙️ **Tecnologías utilizadas**

- Node.js
- Express.js

---

## 📦 **Dependencias**
```bash
npm install zod cors mysql2 dotenv jsonwebtoken
```
---

## 🧾 **Instrucciones de Instalación y Ejecución**

1. **Clonar el repositorio**
```bash
   git clone https://github.com/EugeneWu1/CitasMedicas.git
   cd CitasMedicas
```
2. **Abrir el repositorio**
En tu editor de código de preferencia abre el proyecto desde su ubicación. En VSCode ejecuta:

```bash
   code .
```
3. **Instalar Node.js**  
  Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/).

3. **Instalar las dependencias**
  ```bash
  npm install
  ```
4. **Ejecutar la API**
Para ejecutar la API desde tu terminal ejecuta:
  ```bash
  npm run dev
  ```
  Esto iniciará el servidor en: [http://localhost:3000](http://localhost:3000)




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
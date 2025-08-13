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
- Swagger (Para documentación)
- MYSQL (Para bases de datos)

---

## 📦 **Dependencias**
```bash
npm install express zod cors mysql2 dotenv jsonwebtoken bcrypt express-rate-limit generate-password helmet resend uuid nodemon swagger-jsdoc swagger-ui-express
```
---

## 📁 **Estructura del Proyecto**

```
CitasMedicas/
├── 📄 index.js                    # Punto de entrada principal
├── 📄 swagger.js                  # Configuración de Swagger
├── 📄 emailTemplate.js            # Plantillas de correo
├── 📄 api.http                    # Archivo de pruebas REST Client
├── 📄 package.json                # Dependencias del proyecto
├── 📄 .env.example                # Ejemplo de variables de entorno
├── 📄 script-database.sql         # Script de creación de la DB
├── 📁 Config/
│   └── db.js                      # Configuración de base de datos
├── 📁 Controllers/
│   ├── auth.controller.js         # Controlador de autenticación
│   ├── citas.controller.js        # Controlador de citas
│   ├── notificaciones.controller.js # Controlador de notificaciones
│   └── servicios.controller.js    # Controlador de servicios
├── 📁 Models/
│   ├── auth.models.js             # Modelo de usuarios
│   ├── citas.models.js            # Modelo de citas
│   ├── notificaciones.models.js   # Modelo de notificaciones
│   └── servicios.models.js        # Modelo de servicios
├── 📁 Routes/
│   ├── auth.routes.js             # Rutas de autenticación
│   ├── citas.routes.js            # Rutas de citas
│   ├── notificationes.routes.js   # Rutas de notificaciones
│   └── servicios.routes.js        # Rutas de servicios
├── 📁 Schemas/
│   ├── auth.schema.js             # Validaciones de autenticación
│   ├── citas.schema.js            # Validaciones de citas
│   ├── notificaciones.schema.js   # Validaciones de notificaciones
│   └── servicios.schema.js        # Validaciones de servicios
└── 📁 middlewares/
    ├── asyncHandler.js            # Manejo de errores asíncronos
    ├── errorHandler.js            # Middleware de manejo de errores
    ├── isAdmin.js                 # Middleware de autorización admin
    └── isAuth.js                  # Middleware de autenticación JWT
```

---

## 👤 **Funcionalidades por Rol**

### 🔵 **Cliente (client)**
- ✔ Registrarse en el sistema
- ✔ Iniciar sesión
- ✔ Cambiar contraseña
- ✔ Ver servicios disponibles
- ✔ Crear citas médicas
- ✔ Ver sus propias citas
- ✔ Actualizar sus citas
- ✔ Cancelar sus citas
- ✔ Consultar horarios disponibles
- ✔ Ver sus notificaciones
- ✔ Marcar notificaciones como leídas

### 🔴 **Administrador (admin)**
- ✔ **Todas las funciones de cliente** +
- ✔ Ver todos los usuarios del sistema
- ✔ Filtrar usuarios por rol
- ✔ Crear servicios médicos
- ✔ Actualizar servicios médicos
- ✔ Cambiar disponibilidad de servicios
- ✔ Eliminar servicios médicos
- ✔ Ver todas las citas (programadas, canceladas, completadas)
- ✔ Eliminar cualquier cita
- ✔ Crear notificaciones para usuarios
- ✔ Gestión completa del sistema

---

## 🧾 **Instrucciones de Instalación y Ejecución**

1. **Clone el repositorio**

```bash
   git clone https://github.com/EugeneWu1/CitasMedicas.git
   cd CitasMedicas
```

2. **Abra el repositorio**

  En su editor de código de preferencia abra el proyecto desde su ubicación. En VSCode ejecute:

```bash
   code .
```

3. **Instalar Node.js**  

  Descargue e instale Node.js desde [nodejs.org](https://nodejs.org/).

3. **Instalar las dependencias**

  ```bash
  npm install
  ```

4. **Ejecutar la API**

  Para ejecutar la API desde su terminal  en modo desarrollo ejecute:

  ```bash
  npm run dev
  ```

5. **Ejecutar la API**

  Para ejecutar la API desde su terminal  en modo de produccion ejecute:

  ```bash
  npm run start
  ```
  Esto iniciará el servidor en: [http://localhost:3000](http://localhost:3000)
  
6. **Valide que el esquema del .env.example del proyecto sea el mismo que el del esquema de su archivo .env de production**

  ```bash
   DB_HOST=
   DB_USER=
   DB_PASSWORD=
   DB_NAME=
   DB_PORT=
   JWT_SECRET=
   RESEND_API_KEY=
   PORT=
   NODE_ENV=development ##para ver stack traces
  ```

7. **Crear las tablas en su cliente local de mysql con el script de creacion contenido en el proyecto**
   
   ```bash
   script-database.sql
   ```
   
9. **Probar la api desplegada**
   
  Ejecute la api desplegada en render desde: [https://emewesdev-clinic.onrender.com/api/](https://emewesdev-clinic.onrender.com/api/)


---


## 📚 **Documentación de la API**

### Swagger UI
La documentación interactiva de la API está disponible en:

- Entorno de producción
👉 [https://emewesdev-clinic.onrender.com/api-docs](https://emewesdev-clinic.onrender.com/api-docs)


Puede explorar y probar distintos escenarios para los endpoints directamente desde esa interfaz.

---

## 🔗 **Endpoints de la API**

### 🔐 **Autenticación (`/api/auth`)**

#### `POST /auth/register`
- **Descripción**: Registrar un nuevo usuario en el sistema
- **Protección**: 🔓 Público
- **Ejemplo de uso**:
```json
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "phone": "99887766",
  "role": "client"
}
```
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Usuario creado correctamente",
  "data": {
    "id": "uuid-generado",
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "phone": "99887766"
  }
}
```
- **Nota**: Se genera una contraseña temporal automáticamente y se envía por correo electrónico

#### `POST /auth/login`
- **Descripción**: Iniciar sesión y obtener token JWT
- **Protección**: 🔓 Público
- **Ejemplo de uso**:
```json
{
  "user": "juan@email.com",
  "password": "miPassword123"
}
```
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Usuario autenticado correctamente",
  "data": {
    "role": "client",
    "name": "Juan Pérez"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Respuesta si debe cambiar contraseña (200)**:
```json
{
  "success": true,
  "message": "Debe cambiar su contraseña, su token temporal es válido por 1 hora",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "mustChangePassword": true
  }
}
```

#### `PATCH /auth/set-password`
- **Descripción**: Actualizar contraseña del usuario
- **Protección**: 🔒 `verifyToken`
- **Ejemplo de uso**:
```json
{
  "old_password": "passwordAnterior",
  "new_password": "nuevoPassword123",
  "confirm_password": "nuevoPassword123"
}
```
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

#### `GET /auth/users`
- **Descripción**: Listar todos los usuarios del sistema
- **Protección**: 🔒 `verifyToken` + 🛡️ `isAdmin`
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Usuario 1",
      "email": "user1@email.com",
      "role": "client",
      "phone": "99887766",
      "created_at": "2025-08-09T10:00:00Z"
    }
  ],
  "total": 1
}
```

#### `GET /auth/users/role?role=client`
- **Descripción**: Filtrar usuarios por rol específico
- **Protección**: 🔒 `verifyToken` + 🛡️ `isAdmin`
- **Parámetros**: `role` (client|admin)
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Usuarios con rol (client|admin) obtenidos correctamente",
  "data": [
    {
      "id": "uuid",
      "name": "Cliente 1",
      "email": "cliente1@email.com",
      "role": "client",
      "phone": "99887766",
      "created_at": "2025-08-09T10:00:00Z"
    }
  ],
  "total": 1
}
```

---


### 🏥 **Servicios Médicos (`/api/servicios`)**

#### `GET /servicios`
- **Descripción**: Listar todos los servicios médicos
- **Protección**: 🔓 Público
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "service_id": "uuid",
      "name": "Consulta General",
      "description": "Consulta médica general",
      "duration": 30,
      "price": 500.00,
      "available": 1
    }
  ]
}
```

#### `GET /servicios/disponibilidad?available=true`
- **Descripción**: Filtrar servicios por disponibilidad
- **Protección**: 🔓 Público
- **Query Params**: `available` (true|false)
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "service_id": "uuid",
      "name": "Consulta General",
      "description": "Consulta médica general",
      "duration": 30,
      "price": 500.00,
      "available": 1
    }
  ]
}
```

#### `POST /servicios`
- **Descripción**: Crear un nuevo servicio médico
- **Protección**: 🔒 `verifyToken` + 🛡️ `isAdmin`
- **Ejemplo de uso**:
```json
{
  "name": "Consulta Pediátrica",
  "description": "Evaluación médica para niños",
  "duration": 40,
  "price": 700.00,
  "available": true
}
```
- **Respuesta exitosa (201)**:
```json
{
  "success": true,
  "data": {
    "service_id": "uuid-generado",
    "name": "Consulta Pediátrica",
    "description": "Evaluación médica para niños",
    "duration": 40,
    "price": 700.00,
    "available": 1
  }
}
```
- **Error nombre duplicado (409)**:
```json
{
  "success": false,
  "message": "Ya existe un servicio con este nombre"
}
```

#### `PUT /servicios/:id`
- **Descripción**: Actualizar un servicio existente
- **Protección**: 🔒 `verifyToken` + 🛡️ `isAdmin`
- **Ejemplo de uso**:
```json
{
  "name": "Consulta General Actualizada",
  "description": "Consulta médica general con nuevos equipos",
  "duration": 35,
  "price": 550.00,
  "available": true
}
```
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Servicio actualizado exitosamente",
  "data": {
    "services": {
      "name": "Consulta General Actualizada",
      "description": "Consulta médica general con nuevos equipos",
      "duration": 35,
      "price": 550.00,
      "available": true
    },
    "affectedRows": 1
  }
}
```

#### `PUT /servicios/:id/disponibilidad`
- **Descripción**: Cambiar disponibilidad de un servicio
- **Protección**: 🔒 `verifyToken` + 🛡️ `isAdmin`
- **Ejemplo de uso**:
```json
{
  "available": false
}
```
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Disponibilidad actualizada exitosamente",
  "data": {
    "service_id": "uuid",
    "available": false
  }
}
```

#### `DELETE /servicios/:id`
- **Descripción**: Eliminar un servicio médico
- **Protección**: 🔒 `verifyToken` + 🛡️ `isAdmin`
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Servicio eliminado exitosamente",
  "data": {
    "service_id": "uuid"
  }
}
```

---


### 📅 **Citas Médicas (`/api/citas`)**

#### `GET /citas`
- **Descripción**: Consultar todas las citas del usuario autenticado con paginación y filtros opcionales
- **Protección**: 🔒 `verifyToken`
- **Query Params**: 
  - `page` (opcional): Número de página para paginación (default: 1, mínimo: 1)
  - `limit` (opcional): Número de citas por página (default: 10, rango: 1-100)
  - `status` (opcional): Filtrar por estado de cita (`scheduled`, `cancelled`, `completed`)
- **Validaciones**:
  - Verifica que el usuario exista antes de consultar
  - Valida parámetros de paginación y estado
- **Ejemplos de uso**:
  - `GET /citas` - Todas las citas del usuario
  - `GET /citas?status=scheduled` - Solo citas programadas
  - `GET /citas?status=cancelled&page=2&limit=5` - Citas canceladas con paginación
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "appointment_id": "uuid",
      "user_id": "uuid",
      "user_name": "Andrea Limas",
      "service_id": "uuid",
      "service_name": "Consulta General",
      "service_description": "Servicio de consulta medica general",
      "service_duration": 30,
      "service_price": 500,
      "appointment_date": "2025-08-16T06:00:00.000Z",
      "start_time": "09:30:00",
      "end_time": "10:00:00",
      "status": "scheduled",
      "notes": "Primera consulta",
      "created_at": "2025-08-09T10:00:00Z",
      "updated_at": "2025-08-10T17:15:42.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 2,
    "itemsPerPage": 1,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```
- **Sin citas (204)**: No Content
- **Nota**: El `user_id` se extrae automáticamente del token JWT, no se debe enviar

#### `GET /citas/admin/citas`
- **Descripción**: Ver todas las citas de todos los usuarios existentes
- **Protección**: 🔒 `verifyToken` + 🛡️ `isAdmin`
- **Query Params**: 
  - `page` (opcional): Número de página para paginación (default: 1, mínimo: 1)
  - `limit` (opcional): Número de citas por página (default: 10, rango: 1-100)
  - `status` (opcional): Filtrar por estado de cita (`scheduled`, `cancelled`, `completed`)
- **Validaciones**:
  - Valida parámetros de paginación y estado
- **Ejemplos de uso**:
  - `GET /citas/admin/citas` - Todas las citas existentes
  - `GET /citas/admin/citas?status=scheduled` - Solo citas programadas
  - `GET /citas/admin/citas?status=cancelled&page=2&limit=5` - Citas canceladas con paginación
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "appointment_id": "uuid",
      "user_id": "uuid",
      "user_name": "Andrea Limas",
      "user_email": "easl2991@gmail.com",
      "service_id": "uuid",
      "service_name": "Consulta General",
      "appointment_date": "2025-08-16T06:00:00.000Z",
      "start_time": "09:30:00",
      "end_time": "10:00:00",
      "status": "scheduled",
      "notes": "Primera consulta",
      "created_at": "2025-08-09T10:00:00Z",
      "updated_at": "2025-08-10T17:15:42.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 2,
    "itemsPerPage": 1,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```
- **Sin citas (204)**: No Content 



#### `POST /citas`
- **Descripción**: Crear una nueva cita médica con validaciones completas
- **Protección**: 🔒 `verifyToken`
- **Validaciones**: 
  - Verifica que el usuario exista
  - Verifica que el servicio exista y esté disponible
  - Verifica disponibilidad de horario (sin conflictos)
  - Verifica que el usuario no tenga otra cita en el mismo horario
- **Ejemplo de uso**:
```json
{
  "user_id": "uuid-usuario",
  "service_id": "uuid-servicio",
  "appointment_date": "2025-08-15",
  "start_time": "09:30:00",
  "notes": "Primera consulta"
}
```
- **Respuesta exitosa (201)**:
```json
{
  "success": true,
  "message": "Cita creada exitosamente",
  "data": {
    "appointment_id": "uuid-generado",
    "user_id": "uuid-usuario",
    "service_id": "uuid-servicio",
    "appointment_date": "2025-08-15",
    "start_time": "09:30:00",
    "end_time": "10:00:00",
    "status": "scheduled",
    "notes": "Primera consulta"
  }
}
```
- **Usuario no existe (404)**:


#### `PUT /citas/:id`
- **Descripción**: Actualizar una cita existente
- **Protección**: 🔒 `verifyToken`
- **Ejemplo de uso**:
```json
{
  "appointment_date": "2025-08-16",
  "start_time": "14:00:00",
  "notes": "Cita reprogramada por solicitud del paciente"
}
```
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Cita actualizada exitosamente",
  "data": {
    "citaData": {
      "appointment_date": "2025-08-16",
      "start_time": "14:00:00",
      "notes": "Cita reprogramada por solicitud del paciente",
    },
    "affectedRows": 1
  }
}
```

#### `DELETE /citas/:id`
- **Descripción**: Eliminar una cita específica
- **Protección**: 🔒 `verifyToken`
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Cita eliminada correctamente",
  "data":{
    "Id": "uuid"
  }
}
```

---

### 🔔 **Notificaciones (`/api/notificaciones`)**

#### `GET /notificaciones`
- **Descripción**: Listar todas las notificaciones del usuario autenticado con filtros opcionales
- **Protección**: 🔒 `verifyToken`
- **Query Params**: 
  - `is_read` (opcional): Filtrar por estado de lectura (true|false)
- **Validaciones**: 
  - Verifica que el usuario exista
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Notificaciones obtenidas exitosamente",
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "appointment_id": "uuid",
      "type": "cita_creada",
      "title": "Cita Programada",
      "message": "Su cita ha sido programada exitosamente para el 15 de agosto a las 10:00 AM",
      "is_read": 0,
      "created_at": "2025-08-09T10:00:00Z"
    }
  ],
  "total": 5
}
```
- **Sin notificaciones (204)**: No Content


#### `POST /notificaciones`
- **Descripción**: Crear una nueva notificación para el usuario autenticado
- **Protección**: 🔒 `verifyToken`
- **Validaciones**: 
  - Valida datos de entrada con schema Zod
  - Verifica que el usuario exista
- **Tipos disponibles**: `cita_creada`, `cita_cancelada`, `recordatorio`, `sistema`
- **Ejemplo de uso**:
```json
{
  "type": "sistema",
  "title": "Actualización del Sistema",
  "message": "El sistema estará en mantenimiento el próximo domingo de 2:00 AM a 4:00 AM."
}
```
- **Respuesta exitosa (201)**:
```json
{
  "success": true,
  "message": "Notificación creada exitosamente",
  "data": {
    "notification_id": "uuid-generado"
  }
}
```

- **Nota**: El `user_id` se extrae automáticamente del token JWT, no se debe enviar

#### `PUT /notificaciones/:notificationId/read`
- **Descripción**: Marcar notificación específica como leída
- **Protección**: 🔒 `verifyToken`
- **Validaciones**: 
  - Valida que el ID de notificación sea válido
  - Verifica que la notificación exista y pertenezca al usuario autenticado
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Notificación marcada como leída"
}
```
- **Nota**: El `user_id` se extrae automáticamente del token JWT


#### `DELETE /notificaciones/:notificationId`
- **Descripción**: Eliminar una notificación específica del usuario autenticado
- **Protección**: 🔒 `verifyToken`
- **Validaciones**: 
  - Valida que el ID de notificación sea válido
  - Verifica que la notificación exista y pertenezca al usuario autenticado
- **Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Notificación eliminada exitosamente"
}
```
- **Nota**: El `user_id` se extrae automáticamente del token JWT

---

## 📊 **Códigos de Estado HTTP**

### ✅ **Códigos de Éxito (2xx)**
- **200 OK**: Solicitud exitosa, datos devueltos
- **201 Created**: Recurso creado exitosamente
- **204 No Content**: Operación exitosa sin contenido de respuesta

### ⚠️ **Códigos de Error del Cliente (4xx)**
- **400 Bad Request**: Datos de entrada inválidos o faltantes
- **401 Unauthorized**: Token de autenticación faltante o inválido
- **403 Forbidden**: Acceso denegado, permisos insuficientes
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto con el estado actual (ej: horario ocupado)
- **422 Unprocessable Entity**: Error de validación de datos
- **429 Too Many Requests**: Límite de rate limiting excedido

### 🔥 **Códigos de Error del Servidor (5xx)**
- **500 Internal Server Error**: Error interno del servidor
- **503 Service Unavailable**: Servicio temporalmente no disponible

---

## 🛡️ **Middlewares de Protección**

### 🔒 **verifyToken**
- Valida la presencia y validez del token JWT
- Extrae información del usuario del token
- Requerido para endpoints autenticados

### 🛡️ **isAdmin**
- Verifica que el usuario tenga rol de administrador
- Debe usarse junto con `verifyToken`
- Requerido para operaciones administrativas

### ⚡ **Otros Middlewares**
- **Rate Limiting**: 50 requests por 5 minutos
- **CORS**: Configurado para múltiples orígenes
- **Helmet**: Headers de seguridad
- **Express Rate Limit**: Protección contra ataques de fuerza bruta

---

## **© EMEWESDEV Co. Todos los derechos reservados 2025** 

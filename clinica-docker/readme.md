# 🏥 Proyecto - `clinic_project`

Este proyecto configura un contenedor de MySQL 8 usando Docker, incluyendo un script de inicialización con tablas para clientes, servicios y citas. Esto permite construir una API RESTful para gestionar citas en una clínica.

---

## 🚀 Instrucciones para iniciar

1. Asegúrate de tener instalado Docker: https://www.docker.com/

2. Desde la raíz del proyecto, ejecuta:

   ```bash
   docker compose up -d
   ```

   Esto iniciará un contenedor MySQL con:
   - Base de datos: dbClinica
   - Usuario: clinicaUser
   - Contraseña: clinica123
   - Puerto expuesto: 3307

---

## 🔐 Datos de conexión

- Host: localhost
- Puerto: 3307
- Base de datos: dbClinica
- Usuario: clinicaUser
- Contraseña: clinica123
- Usuario root: root
- Contraseña root: clinica123

> El puerto 3307 se usa para evitar conflictos con instalaciones locales de MySQL.

---

## 🗂 Estructura del proyecto

- docker-compose.yml: Configuración de Docker para MySQL
- init/init.sql: Script de inicialización de base de datos
- README.md

---

## 🧱 Estructura de las tablas

### Tabla: client

- client_id: BINARY(16), UUID como clave primaria
- name: VARCHAR(50), nombre del cliente
- email: VARCHAR(50), único
- phone: VARCHAR(20), número de teléfono
- password_hash: VARCHAR(255), contraseña cifrada con bcrypt
- role: ENUM('client', 'admin')
- must_change_password: BOOLEAN, indica si debe cambiar su contraseña
- created_at: TIMESTAMP, fecha de creación

### Tabla: service

- service_id: CHAR(36), UUID como texto
- name: VARCHAR(50), nombre del servicio
- description: VARCHAR(200), descripción del servicio
- duration: INT, duración en minutos
- created_at: TIMESTAMP, fecha de creación

### Tabla: appointment

- appointment_id: CHAR(36), UUID como texto
- client_id: BINARY(16), referencia a client
- service_id: CHAR(36), referencia a service
- appointment_date: DATETIME, fecha y hora de la cita
- status: ENUM('scheduled', 'cancelled'), estado de la cita
- created_at: TIMESTAMP, fecha de creación

---

## 📥 Datos de ejemplo (init.sql)

```sql
USE dbClinica;

-- Cliente de prueba
INSERT INTO client (client_id, name, email, phone, password_hash, role, must_change_password)
VALUES (
  UUID_TO_BIN(UUID()), 
  'Juan Pérez', 
  'juan@example.com', 
  '9999-8888', 
  '$2b$10$zUkJt0GqK2R0VHILUXvvIOhT0eG6U2sY.CW8D7h9b77uXkF3ZkEHe', -- bcrypt de 'password123'
  'client', 
  false
);

-- Servicio de prueba
INSERT INTO service (service_id, name, description, duration)
VALUES (
  UUID(), 
  'Consulta General', 
  'Evaluación médica general', 
  30
);

-- Cita de prueba
INSERT INTO appointment (appointment_id, client_id, service_id, appointment_date)
SELECT 
  UUID(),
  c.client_id,
  s.service_id,
  '2025-08-01 10:30:00'
FROM client c, service s
LIMIT 1;
```

---

## 🔍 Consultas útiles

Ver clientes con UUID legible:

```sql
SELECT BIN_TO_UUID(client_id) AS client_id, name, email, phone, role, must_change_password, created_at FROM client;
```

Ver todos los servicios:

```sql
SELECT service_id, name, description, duration, created_at FROM service;
```

Ver todas las citas con detalles:

```sql
SELECT 
  a.appointment_id,
  BIN_TO_UUID(a.client_id) AS client_id,
  c.name AS client_name,
  s.name AS service_name,
  a.appointment_date,
  a.status,
  a.created_at
FROM appointment a
JOIN client c ON a.client_id = c.client_id
JOIN service s ON a.service_id = s.service_id;
```

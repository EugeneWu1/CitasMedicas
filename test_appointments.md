# Sistema de Gestión de Citas Médicas - Implementación Completa

## Funcionalidades Implementadas

### 1. Validaciones en el Modelo de Citas (`citas.models.js`)

- ✅ **checkDuplicateAppointment**: Verifica citas duplicadas para el mismo usuario, fecha y hora
- ✅ **checkTimeConflict**: Detecta conflictos de horario entre citas
- ✅ **getServiceInfo**: Obtiene información del servicio (duración, disponibilidad)
- ✅ **calculateEndTime**: Calcula el tiempo de fin basado en la duración del servicio

### 2. Lógica de Control en el Controlador (`citas.controller.js`)

#### Crear Cita (`create`)
- ✅ Validación de datos de entrada con schema
- ✅ Verificación de existencia y disponibilidad del servicio
- ✅ Cálculo automático de `end_time` basado en `duration`
- ✅ Verificación de citas duplicadas
- ✅ Verificación de conflictos de horario
- ✅ Cambio de disponibilidad del servicio a `0` (no disponible)

#### Actualizar Cita (`update`)
- ✅ Validación de datos y ID de cita
- ✅ Manejo de cambio de servicio (libera el anterior, reserva el nuevo)
- ✅ Verificación de duplicados y conflictos en cambios de fecha/hora
- ✅ Gestión de estados:
  - `scheduled` → `completed`/`cancelled`: libera servicio (`available = 1`)
  - `completed`/`cancelled` → `scheduled`: reserva servicio (`available = 0`)

### 3. Reutilización de Código

- ✅ Uso de `cambiarDisponibilidad` del modelo de servicios
- ✅ Separación clara entre lógica de datos (models) y control (controllers)
- ✅ Evita duplicación de código para manejo de disponibilidad

### 4. Estructura de Base de Datos

```sql
-- Tabla appointment
- appointment_date: DATE (solo fecha)
- start_time: TIME (solo hora)
- end_time: TIME (solo hora)
- user_id: BINARY(16) (conversión UUID)
- service_id: CHAR(36) (UUID)
- status: ENUM('scheduled','cancelled','completed')

-- Tabla service
- duration: INT (minutos)
- available: TINYINT(1) (0=no disponible, 1=disponible)
```

### 5. Flujo de Disponibilidad de Servicios

```
Crear cita: available = 0
Actualizar cita (mismo servicio): no cambia
Actualizar cita (cambiar servicio): anterior = 1, nuevo = 0
Cambiar a completed/cancelled: available = 1
Cambiar a scheduled: available = 0 (si disponible)
```

### 6. Códigos de Respuesta HTTP

- **201**: Cita creada exitosamente
- **200**: Cita actualizada/consultada exitosamente
- **400**: Datos inválidos o servicio no disponible
- **404**: Servicio o cita no encontrada
- **409**: Conflicto (duplicado o solapamiento de horarios)

### 7. Validaciones Implementadas

- UUID válidos para user_id y service_id
- Formato de fecha (YYYY-MM-DD)
- Formato de hora (HH:MM:SS)
- Fechas no pueden ser en el pasado
- Hora de inicio < hora de fin
- No duplicados por usuario/fecha/hora
- No conflictos de horario entre citas
- Servicios deben existir y estar disponibles

## Archivos Modificados

1. `Models/citas.models.js` - Funciones de validación y consulta
2. `Controllers/citas.controller.js` - Lógica de control completa
3. `Schemas/citas.schema.js` - Validaciones de entrada (ya existía)

## Uso de Funciones Existentes

- `cambiarDisponibilidad()` del modelo de servicios
- Esquemas de validación existentes
- Conexiones y transacciones de base de datos establecidas

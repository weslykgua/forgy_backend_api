# Forgy API Postman Package

Esta carpeta contiene la colección de Postman y el archivo de entorno local actualizados para probar todos los endpoints del backend de Forgy.

## Archivos Disponibles

- `Forgy API.postman_collection.json` - Colección completa de Postman con todas las rutas y cuerpos de ejemplo listos.
- `Forgy.local.postman_environment.json` - Entorno para desarrollo local que apunta a `http://localhost:3000`.
- `Forgy.production.postman_environment.json` - Entorno para producción en Railway. Solo debes reemplazar el valor de `baseUrl` con la URL de tu aplicación en Railway.

## Pasos para Importar y Utilizar en Postman

1. **Importar el Entorno**: En Postman, ve a "Import" y selecciona `Forgy.local.postman_environment.json`.
2. **Importar la Colección**: Importa `Forgy API.postman_collection.json`.
3. **Seleccionar el Entorno**: En la esquina superior derecha de Postman, selecciona el entorno `Forgy Local`.
4. **Registrar / Loguear**:
   - Corre la petición en `Auth > Register` (para crear una cuenta de prueba) o `Auth > Login`.
   - Copia el valor del campo `token` devuelto por la respuesta.
5. **Configurar el Token**: Pega el token en el valor actual de la variable `token` dentro de la configuración del entorno `Forgy Local`. Esto autenticará automáticamente todas las peticiones protegidas.
6. **Configurar IDs Dinámicos**: A medida que crees rutinas, ejercicios, metas o recomendaciones, copia sus respectivos IDs y guárdalos en las variables de entorno (`{{routineId}}`, `{{exerciseId}}`, `{{goalId}}`, etc.) para que las peticiones parametrizadas funcionen automáticamente.

## Rutas Cubiertas

- **Autenticación (`/auth`)**: Registro e Inicio de sesión.
- **Usuario (`/user`)**: Obtener/Actualizar perfil completo, Cambiar contraseña, Eliminar cuenta y Obtener racha.
- **Dashboard (`/dashboard`)**: Métricas resumidas de los últimos 30 días.
- **Ejercicios (`/exercises`)**: Listado de ejercicios y estadísticas.
- **Metas (`/goals`)**: Obtener/Guardar/Eliminar plan, Listar/Crear/Actualizar/Eliminar metas y Obtener progreso.
- **Progreso Diario (`/progress`)**: Registrar/Actualizar progreso, Obtener historial y Estadísticas.
- **Entrenamientos (`/workouts`)**: Registrar sesión, Obtener por fecha, Calendario mensual, Actualizar/Eliminar sesión, Historial, Racha y Récords Personales.
- **Rutinas (`/routines`)**: Listar, Crear, Actualizar, Eliminar y Gestión de ejercicios dentro de la rutina.
- **Mediciones Corporales (`/measurements`)**: Registrar y listar mediciones.
- **Recomendaciones de IA (`/ai`)**: Generar recomendaciones, listar recomendaciones y cambiar estado (Aceptar/Descartar).
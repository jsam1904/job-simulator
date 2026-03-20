# iPhone Inventory — REST CRUD API

API REST con operaciones CRUD completas sobre un inventario de iPhones. Construida con Node.js + Express, persistencia en PostgreSQL y entorno completamente containerizado con Docker Compose.

---

## Nivel entregado

**Nivel 2 — Mid** `(máximo 85/100)`

Incluye además los requisitos de Nivel 3: `.env.example`, `.gitignore`, script SQL de inicialización automática y separación de responsabilidades en el código.

**Bonuses completados:**

- Integración full stack (+10)
- Personalización del frontend (+5)

---

## Recurso: `iphones`

### Estructura

| Campo  | Campo interno | Tipo    | Restricciones              |
| ------ | ------------- | ------- | -------------------------- |
| id     | id            | integer | primary key, autoincrement |
| campo1 | model         | string  | requerido                  |
| campo2 | color         | string  | requerido                  |
| campo3 | storage       | string  | requerido                  |
| campo4 | stock         | integer | requerido                  |
| campo5 | price         | float   | requerido                  |
| campo6 | available     | boolean | requerido                  |

---

## Endpoints

| Método | Ruta           | Descripción              | Código éxito |
| ------ | -------------- | ------------------------ | ------------ |
| GET    | /iphones       | Lista todos los iPhones  | 200          |
| GET    | /iphones/:id   | Obtiene un iPhone por ID | 200          |
| POST   | /iphones       | Crea un nuevo iPhone     | 201          |
| PUT    | /iphones/:id   | Reemplaza un iPhone      | 200          |
| DELETE | /iphones/:id   | Elimina un iPhone        | 200          |

### Ejemplo de body (POST / PUT)

```json
{
  "campo1": "iPhone 15 Pro",
  "campo2": "Titanio Natural",
  "campo3": "256GB",
  "campo4": 10,
  "campo5": 1299.99,
  "campo6": true
}
```

### Ejemplo de respuesta

```json
{
  "id": 1,
  "campo1": "iPhone 15 Pro",
  "campo2": "Titanio Natural",
  "campo3": "256GB",
  "campo4": 10,
  "campo5": 1299.99,
  "campo6": true
}
```

---

## Stack

- **Runtime:** Node.js 20
- **Framework:** Express 4
- **Base de datos:** PostgreSQL 16
- **Containerización:** Docker + Docker Compose

---

## Levantar el sistema

### 1. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con los valores deseados:

```env
DB_HOST=db
DB_PORT=5432
DB_NAME=iphones_db
DB_USER=admin
DB_PASSWORD=secret

PORT=8080
```

### 2. Levantar con Docker Compose

```bash
docker-compose up --build
```

Esto levanta tres servicios:

| Servicio | Puerto | Descripción              |
| -------- | ------ | ------------------------ |
| db       | 5432   | PostgreSQL               |
| app      | 8080   | API REST                 |
| frontend | 8088   | Cliente web              |

- API disponible en: `http://localhost:8080`
- Frontend disponible en: `http://localhost:8088`
- Health check: `http://localhost:8080/health`

La base de datos se inicializa automáticamente con `db/init.sql`. La aplicación espera a que PostgreSQL esté listo antes de arrancar.

---

## Estructura del proyecto

```text
.
├── src/
│   ├── index.js          # Punto de entrada
│   ├── config/
│   │   └── db.js         # Configuración y conexión a PostgreSQL
│   └── routes/
│       └── iphones.js    # Rutas y lógica del recurso
├── db/
│   └── init.sql          # Esquema inicial
├── frontend/
│   ├── public/           # HTML, JS y configuración del cliente
│   ├── nginx.conf        # Configuración nginx (proxy /api → app:8080)
│   └── Dockerfile
├── dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## Validaciones

Todos los campos son requeridos. Los tipos son validados estrictamente:

- `campo1`, `campo2`, `campo3`: string no vacío
- `campo4`: entero
- `campo5`: número (float)
- `campo6`: booleano

Errores de validación retornan `400` con el detalle de los campos inválidos.

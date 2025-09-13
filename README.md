
# API de un Sistema de Auditoría y Eventos

## Descripción
Este proyecto implementa un sistema de auditoría fiable y escalable para aplicaciones, permitiendo rastrear y almacenar cada acción importante del usuario (creación, actualización y eliminación) para su posterior análisis. El sistema está construido con una arquitectura basada en microservicios y comunicación asíncrona mediante colas de mensajes.

## Tabla de Contenidos
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Endpoints Principales](#endpoints-principales)
- [Contribución](#contribución)
- [Pruebas](#pruebas)
- [Contacto](#contacto)

## Arquitectura
El sistema sigue el patrón Outbox y utiliza RabbitMQ para la comunicación asíncrona entre servicios. Los eventos de usuario se almacenan en una tabla outbox y luego se publican en RabbitMQ. Los consumidores procesan estos eventos y los indexan en Elasticsearch para búsquedas rápidas, utilizando Redis como caché.

**Componentes principales:**
- **API REST (Express.js):** expone endpoints para gestión de usuarios y auditorías.
- **MySQL:** almacenamiento principal de usuarios y eventos outbox.
- **RabbitMQ:** cola de mensajes para eventos de usuario.
- **Elasticsearch:** indexación y búsqueda de auditorías.
- **Redis:** caché para optimizar búsquedas.
- **Node-cron:** procesamiento periódico de la tabla outbox.

## Tecnologías
- Node.js, Express.js
- MySQL, Sequelize ORM
- RabbitMQ (amqplib)
- Elasticsearch
- Redis
- Zod (validaciones)
- JWT (autenticación)
- Docker (recomendado para servicios externos)

## Estructura de Carpetas
```text
├── app.js                  # Punto de entrada principal
├── controllers/            # Lógica de controladores (usuarios, auditorías)
├── consumer/               # Consumidores de eventos RabbitMQ
├── database/               # Configuración de bases de datos (MySQL, Redis, Elasticsearch)
├── middlewares/            # Middlewares de Express
├── models/                 # Modelos de datos (Sequelize)
├── routes/                 # Definición de rutas
├── services/               # Servicios (cron, RabbitMQ, lógica de usuario)
├── validations/            # Validaciones de entrada (Zod)
├── package.json            # Dependencias y scripts
└── .env                    # Variables de entorno (no versionado)
```

## Instalación
1. Clona el repositorio:
	```bash
	git clone https://github.com/Angelitoo777/API-de-un-Sistema-de-Auditor-a-y-Eventos.git
	cd API-de-un-Sistema-de-Auditor-a-y-Eventos
	```
2. Instala las dependencias:
	```bash
	npm install
	```
3. Configura las variables de entorno en un archivo `.env`:
	```env
	PORT=3000
	DATABASE_NAME=auditoria_db
	DATABASE_USERNAME=usuario
	DATABASE_PASSWORD=contraseña
	DATABASE_HOST=localhost
	URL_RABBITMQ=amqp://localhost
	ELASTIC_HOST=https://localhost:9200
	ELASTIC_APIKEY=tu_apikey
	REDIS_HOST=localhost
	REDIS_PORT=6379
	JWT_SECRET=tu_jwt_secret
	NODE_ENV=development
	```
4. Inicia la API:
	```bash
	npm run dev
	```
5. Inicia los consumidores (en terminales separadas):
	```bash
	node consumer/user.consumer.js
	node consumer/userUpdate.consumer.js
	node consumer/userDelete.consumer.js
	```

## Uso
La API expone endpoints para registrar, autenticar, actualizar y eliminar usuarios, así como para consultar auditorías.

## Endpoints Principales

### Usuarios
- `POST /auth/register` — Registrar usuario
- `POST /auth/login` — Login de usuario
- `GET /auth/users` — Listar usuarios
- `PATCH /auth/users/:id` — Actualizar usuario
- `DELETE /auth/users/:id` — Eliminar usuario

### Auditorías
- `GET /api/audits/search?id={id}|email={email}` — Buscar auditorías por ID o email

## Contribución
1. Haz un fork del repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz commit (`git commit -am 'Agrega nueva funcionalidad'`)
4. Haz push a tu rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Pruebas
Actualmente no hay pruebas automatizadas. Se recomienda usar herramientas como Jest o Mocha para agregar tests.

## Contacto
Autor: Angel Oropeza  
Email: angeloropeza1604@gmail.com

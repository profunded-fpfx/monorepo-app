# Docker Setup Guide

Este documento explica cómo usar Docker para ejecutar la aplicación monorepo.

## Requisitos Previos

- Docker Desktop instalado
- Docker Compose instalado (incluido con Docker Desktop)

## Estructura de Archivos Docker

```
.
├── docker-compose.yml              # Orquestación de servicios
├── .dockerignore                   # Archivos a ignorar en builds
├── packages/
│   ├── backend/
│   │   └── Dockerfile             # Imagen del backend (NestJS)
│   └── web/
│       └── Dockerfile             # Imagen del web (Next.js)
```

## Comandos Principales

### Iniciar todos los servicios

```bash
docker-compose up
```

O en modo detached (segundo plano):

```bash
docker-compose up -d
```

### Reconstruir las imágenes

Si has hecho cambios en el código:

```bash
docker-compose up --build
```

### Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo web
docker-compose logs -f web
```

### Detener los servicios

```bash
docker-compose down
```

### Detener y eliminar volúmenes

```bash
docker-compose down -v
```

## Servicios y Puertos

| Servicio | Puerto | URL                      |
|----------|--------|--------------------------|
| Web      | 3000   | http://localhost:3000    |
| Backend  | 4000   | http://localhost:4000    |

## Construir Imágenes Individuales

### Backend

```bash
docker build -f packages/backend/Dockerfile -t monorepo-backend .
docker run -p 4000:4000 monorepo-backend
```

### Web

```bash
docker build -f packages/web/Dockerfile -t monorepo-web .
docker run -p 3000:3000 monorepo-web
```

## Variables de Entorno

Puedes crear un archivo `.env` en la raíz del proyecto para configurar variables de entorno:

```env
# Backend
NODE_ENV=production
PORT=4000

# Web
NEXT_PUBLIC_API_URL=http://backend:4000
NEXT_TELEMETRY_DISABLED=1
```

Luego actualiza `docker-compose.yml` para usar el archivo:

```yaml
services:
  backend:
    env_file:
      - .env
```

## Health Checks

Ambos servicios incluyen health checks:

- **Backend**: `GET /health` - Retorna `{ status: 'ok' }`
- **Web**: Request a la raíz `/`

Los health checks se ejecutan cada 30 segundos.

## Optimizaciones

### Multi-stage Builds

Los Dockerfiles usan builds multi-etapa para:
- Reducir el tamaño de las imágenes finales
- Separar dependencias de desarrollo y producción
- Mejorar la seguridad

### Capas de caché

Las dependencias se instalan antes de copiar el código fuente para aprovechar la caché de Docker.

### Usuario no-root

Ambas imágenes ejecutan la aplicación con un usuario no privilegiado por seguridad:
- Backend: `nestjs` (UID 1001)
- Web: `nextjs` (UID 1001)

## Troubleshooting

### Error: "Cannot find module"

Reconstruye las imágenes sin caché:

```bash
docker-compose build --no-cache
```

### El backend no responde

Verifica el health check:

```bash
docker-compose ps
```

### Cambios en package.json no se reflejan

Asegúrate de reconstruir:

```bash
docker-compose up --build
```

### Ver el interior del contenedor

```bash
# Entrar al contenedor de backend
docker-compose exec backend sh

# Entrar al contenedor de web
docker-compose exec web sh
```

## Producción

Para deployment en producción:

1. Usa un registry privado para las imágenes
2. Configura variables de entorno apropiadas
3. Considera usar Docker Swarm o Kubernetes
4. Implementa monitoreo y logging centralizado
5. Usa secretos seguros (no archivos .env)

### Ejemplo con Docker Hub

```bash
# Tag y push
docker tag monorepo-backend:latest username/monorepo-backend:v1.0.0
docker push username/monorepo-backend:v1.0.0

docker tag monorepo-web:latest username/monorepo-web:v1.0.0
docker push username/monorepo-web:v1.0.0
```

## Desarrollo Local

Para desarrollo, es recomendable seguir usando:

```bash
pnpm dev
```

Docker está optimizado para producción y CI/CD.

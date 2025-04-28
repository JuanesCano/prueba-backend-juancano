# Prueba Backend

Este es un proyecto backend desarrollado con NestJS

## Tecnologías Utilizadas

- **NestJS**: Framework para construir aplicaciones del lado del servidor
- **TypeScript**: Lenguaje de programación tipado
- **Prisma**: ORM para la gestión de la base de datos
- **PostgreSQL**: Base de datos relacional
- **Jest**: Framework de testing

## Arquitectura y Buenas Prácticas

### Principios SOLID
- **Single Responsibility Principle (SRP)**: Cada clase tiene una única responsabilidad
  - `ProductosService`: Maneja la lógica de negocio de productos
  - `ProductosController`: Maneja las peticiones HTTP
  - `PrismaService`: Maneja la conexión con la base de datos

- **Open/Closed Principle (OCP)**: El código está abierto para extensión pero cerrado para modificación
  - Uso de DTOs para validación de datos
  - Servicios inyectables que pueden ser extendidos

- **Liskov Substitution Principle (LSP)**: Las clases derivadas pueden sustituir a las clases base
  - Implementación de interfaces y tipos genéricos

- **Interface Segregation Principle (ISP)**: Las interfaces son específicas para cada cliente
  - DTOs separados para creación y actualización
  - Servicios con métodos específicos

- **Dependency Inversion Principle (DIP)**: Dependencias inyectadas a través de constructores
  - Uso de inyección de dependencias de NestJS

### Validación y Seguridad
- Validación de datos usando class-validator
- Manejo de errores centralizado
- Respuestas HTTP estandarizadas
- Validación de tipos con TypeScript

### Testing
- Tests unitarios con Jest
- Mocks para servicios y repositorios
- Cobertura de código
- Tests de integración

### Código Limpio
- Nombres descriptivos y significativos
- Funciones pequeñas y enfocadas
- Comentarios explicativos donde es necesario
- Estructura de carpetas organizada

## Requisitos Previos

- Node.js (versión recomendada: 18.x o superior)
- PostgreSQL
- npm

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd prueba-back
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la base de datos:
   - Asegúrate de tener PostgreSQL instalado y corriendo
   - Configura las variables de entorno necesarias en el .env.template esta el ejemplo de como debe de ir tu .env

4. Generar el cliente de Prisma:
```bash
npm run prisma:generate
```

## Configuración

El proyecto utiliza variables de entorno para la configuración. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
DB_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db"
```

## Ejecución del Proyecto

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

## Testing

El proyecto utiliza Jest como framework de testing. Los siguientes comandos están disponibles:

- Ejecutar todos los tests:
```bash
npm test
```

## Estructura del Proyecto

```
src/
├── common/         # Código compartido y utilidades
├── productos/      # Módulo de productos
├── app.module.ts   # Módulo principal de la aplicación
└── main.ts         # Punto de entrada de la aplicación
```

## Pipeline de Git

El proyecto utiliza GitHub Actions para CI/CD. El pipeline incluye:

1. Instalacion de node
2. Ejecución de tests

## Scripts Disponibles

- `npm run build`: Compila el proyecto
- `npm run start`: Inicia el servidor
- `npm run start:dev`: Inicia el servidor en modo desarrollo con hot-reload
- `npm run start:debug`: Inicia el servidor en modo debug
- `npm run start:prod`: Inicia el servidor en modo producción
- `npm run lint`: Ejecuta el linter
- `npm run format`: Formatea el código
- `npm run prisma:generate`: Genera el cliente de Prisma

# Authenticator Service

A NestJS-based authentication and authorization service that provides robust user management, OAuth2 implementation, and secure login workflows.

## Features

- **User Authentication**: Secure login, registration, and email verification.
- **Password Management**: Request password reset and update with secure codes.
- **OAuth2 Implementation**: Support for `authorize` and `token` flows, enabling third-party application integration.
- **Client Management**: Manage OAuth2 clients for secure service-to-service communication.
- **Email Notifications**: Integrated email service using Nodemailer and Handlebars for dynamic templates (e.g., account activation, password reset).
- **Security**: JWT-based authentication, password hashing with Bcrypt, and data validation using `class-validator` .
- **API Documentation**: Interactive Swagger documentation at `/api/docs`.
- **Database Support**: PostgreSQL (via TypeORM) for persistence and Redis for caching/session management.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL & Redis
- **ORM**: TypeORM
- **Validation**: Joi, and Class-validator
- **Mailing**: Nodemailer with Handlebars templates
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- Docker and Docker Compose
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd authenticator
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Copy `.env.template` to `.env` and fill in the required values:
   ```bash
   cp .env.template .env
   ```

### Running the Application

**Development Mode (with Docker):**
This command starts PostgreSQL and Redis via Docker Compose, then launches the NestJS application in watch mode.
```bash
pnpm run start:dev
```

**Production Mode:**
```bash
pnpm run build
pnpm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
`http://localhost:3000/api/docs`

All API endpoints are prefixed with `api/auth`.

## Project Structure

- `src/controller`: API entry points (Auth, OAuth, User, Client).
- `src/service`: Business logic layer.
- `src/entity`: TypeORM database models.
- `src/dto`: Data Transfer Objects for request validation.
- `src/module`: NestJS module definitions.
- `src/templates`: Handlebars templates for email notifications.

## Scripts

- `pnpm run build`: Build the application.
- `pnpm run start`: Start the application.
- `pnpm run format`: Format code with Prettier.

## License

This project is [UNLICENSED](LICENSE).

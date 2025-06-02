# Contractor Timesheet System

A comprehensive backend service for managing contractor timesheet submissions with role-based access control, built with NestJS, PostgreSQL, and Keycloak.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │◄──►│   NestJS API    │◄──►│   PostgreSQL    │
│   (Optional)    │    │   (Port 3000)   │    │   (Port 5432)   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │                 │
                       │   Keycloak      │
                       │   (Port 8080)   │
                       │                 │
                       └─────────────────┘
```

## 🚀 Features

### User Roles & Permissions

- **Admin**: Full system access, user management, timesheet export
- **Recruiter**: Manage assigned contractors, approve/reject timesheets
- **Contractor**: Submit and manage own timesheets

### Core Functionality

- ✅ JWT-based authentication with Keycloak integration
- ✅ Role-based access control (RBAC)
- ✅ Weekly timesheet submission (one per week)
- ✅ Timesheet approval/rejection workflow
- ✅ Pagination on all list endpoints
- ✅ CSV/JSON export functionality
- ✅ Comprehensive logging with NestJS Logger
- ✅ Swagger API documentation
- ✅ Docker containerization

## 🛠️ Technology Stack

- **Backend**: Node.js 20, NestJS
- **Database**: PostgreSQL 15
- **Authentication**: Keycloak, JWT
- **ORM**: TypeORM
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **Validation**: class-validator, class-transformer

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd contractor-timesheet-system
```

### 2. Environment Setup

Copy the environment file and configure as needed:

```bash
cp .env.example .env
```

### 3. Start with Docker Compose

```bash
# Start all services (PostgreSQL, Keycloak, NestJS App)
docker-compose up -d

# View logs
docker-compose logs -f app
```

### 4. Seed the Database

```bash
# Run database seeding
npm run seed
```

### 5. Access the Application

- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **Keycloak Admin**: http://localhost:8080 (admin/admin)

## 🔧 Development Setup

### Local Development

```bash
# Install dependencies
npm install

# Start PostgreSQL and Keycloak
docker-compose up postgres keycloak -d

# Start the application in development mode
npm run start:dev

# Run database seeding
npm run seed
```

### Available Scripts

```bash
npm run start          # Start production server
npm run start:dev      # Start development server with hot reload
npm run start:debug    # Start with debugging enabled
npm run build          # Build the application
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run seed           # Seed the database with sample data
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

## 📚 API Documentation

### Authentication

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Users Management (Admin/Recruiter only)

#### Get All Users
```http
GET /users?page=1&limit=10
Authorization: Bearer <jwt-token>
```

#### Create User (Admin only)
```http
POST /users
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "contractor"
}
```

### Timesheets

#### Create Timesheet (Contractor only)
```http
POST /timesheets
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "projectName": "E-commerce Development",
  "hoursWorked": 40,
  "notes": "Completed user authentication module",
  "weekStartDate": "2024-01-01",
  "weekEndDate": "2024-01-07"
}
```

#### Get Timesheets (Role-based filtering)
```http
GET /timesheets?page=1&limit=10
Authorization: Bearer <jwt-token>
```

#### Approve Timesheet (Recruiter only)
```http
PATCH /timesheets/:id/approve
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "notes": "Approved - good work this week"
}
```

#### Reject Timesheet (Recruiter only)
```http
PATCH /timesheets/:id/reject
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "rejectionReason": "Hours seem excessive for the tasks described"
}
```

### Reports (Admin only)

#### Export Timesheets
```http
GET /reports/export?format=csv
Authorization: Bearer <jwt-token>
```

## 🔐 Test Credentials

After running the seed script, you can use these test accounts:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | admin@example.com | password123 | Full system access |
| Recruiter | recruiter@example.com | password123 | Manages contractors |
| Contractor | contractor1@example.com | password123 | John Contractor |
| Contractor | contractor2@example.com | password123 | Alice Developer |

## 🐳 Docker Configuration

### Services

- **postgres**: PostgreSQL 15 database
- **keycloak**: Keycloak authentication server
- **app**: NestJS application

### Volumes

- `postgres_data`: Persistent PostgreSQL data

### Networks

- `timesheet-network`: Internal network for service communication

## 🔧 Keycloak Configuration

### Realm Setup

1. Access Keycloak Admin Console: http://localhost:8080
2. Login with admin/admin
3. Create realm: `timesheet-realm`
4. Create client: `timesheet-client`
5. Configure client settings:
   - Client Protocol: openid-connect
   - Access Type: confidential
   - Valid Redirect URIs: http://localhost:3000/*

### User Management

Users are managed through the application API, but can also be managed directly in Keycloak for advanced configurations.

## 📊 Database Schema

### Users Table
- id (UUID, Primary Key)
- email (Unique)
- firstName
- lastName
- role (admin/recruiter/contractor)
- keycloakId
- isActive
- managedContractorIds (Array, for recruiters)
- createdAt, updatedAt

### Timesheets Table
- id (UUID, Primary Key)
- contractorId (Foreign Key)
- projectName
- hoursWorked (Decimal)
- notes (Text)
- weekStartDate, weekEndDate
- status (pending/approved/rejected)
- approvedBy, approvedAt
- rejectionReason
- createdAt, updatedAt

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Manual Testing with Swagger

1. Navigate to http://localhost:3000/api/docs
2. Use the "Authorize" button to add your JWT token
3. Test all endpoints interactively

## 🚀 Production Deployment

### Environment Variables

Update the following for production:

```env
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
DB_PASSWORD=<secure-password>
KEYCLOAK_CLIENT_SECRET=<keycloak-client-secret>
```

### Security Considerations

- Use strong JWT secrets
- Enable SSL/TLS in production
- Configure proper CORS settings
- Use environment-specific database credentials
- Enable Keycloak SSL in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in .env

2. **Keycloak Connection Error**
   - Verify Keycloak is accessible
   - Check realm and client configuration

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration settings

### Logs

View application logs:
```bash
docker-compose logs -f app
```

View all service logs:
```bash
docker-compose logs -f
```

## 📞 Support

For support and questions, please create an issue in the repository.

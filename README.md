# Contractor Timesheet System

A comprehensive backend service for managing contractor timesheet submissions with role-based access control, built with NestJS, PostgreSQL, and Keycloak.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │◄──►│   NestJS API    │◄──►│   PostgreSQL    │
│   (Optional)    │    │   (Port 3000)   │    │   (Port 5435)   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │                 │
                       │   Keycloak      │
                       │   (Port 9000)   │
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

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd contractor-timesheet-system
```

### 2. Environment Setup

Copy the environment example file and configure as needed:

```bash
cp .env.example .env
```

**Important**: Update the `.env` file with your specific configuration:
- Change `JWT_SECRET` to a strong, random secret key
- Update database credentials if needed
- Configure Keycloak settings for your environment

## 🐳 Docker Deployment (Recommended)

The easiest way to get started is using Docker Compose, which will set up all required services automatically.

### Quick Start with Docker

```bash
# Start all services (PostgreSQL, Keycloak, NestJS App)
docker-compose up -d

# Wait for services to be ready, then seed the database
npm run seed

# View application logs
docker-compose logs -f app
```

### Docker Services

The Docker setup includes:
- **PostgreSQL** (Port 5435): Main database
- **Keycloak** (Port 9000): Authentication server  
- **NestJS App** (Port 3000): Main application

### Docker Management Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f keycloak

# Rebuild and restart services
docker-compose up -d --build

# Remove all containers and volumes (⚠️ This will delete all data)
docker-compose down -v
```

## 💻 Local Development Setup

For development with hot reload and better debugging experience:

### Prerequisites for Local Development

- Node.js 20+
- PostgreSQL 15+ (or use Docker for database only)
- Keycloak (or use Docker for Keycloak only)

### Step-by-Step Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Start only PostgreSQL and Keycloak using Docker
docker-compose up postgres keycloak -d

# 3. Wait for services to be ready, then start the application
npm run start:dev

# 4. In another terminal, seed the database
npm run seed
```

### Development Scripts

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

## 🌐 Access Your Application

After starting the services, you can access:

- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api/docs
- **Keycloak Admin Console**: http://localhost:9000 (admin/admin)

## 🔑 Test Credentials

After running the seed script, you can use these test accounts:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | admin@example.com | password123 | Full system access |
| Recruiter | recruiter@example.com | password123 | Manages contractors |
| Contractor | contractor1@example.com | password123 | John Contractor |
| Contractor | contractor2@example.com | password123 | Alice Developer |

## ⚡ Quick Testing

Once everything is running, you can quickly test the API:

1. **Login**: POST to http://localhost:3000/auth/login with admin credentials
2. **Get Token**: Copy the `access_token` from the response
3. **Test API**: Use the token in Swagger UI or make direct API calls

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

## 🔧 Keycloak Configuration

### Realm Setup

The application requires a Keycloak realm to be configured. If using Docker, this can be set up manually:

1. Access Keycloak Admin Console: http://localhost:9000
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

### Docker Configuration Details

#### Services
- **postgres**: PostgreSQL 15 database
- **keycloak**: Keycloak authentication server
- **app**: NestJS application

#### Volumes
- `postgres_data`: Persistent PostgreSQL data

#### Networks
- `timesheet-network`: Internal network for service communication

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
   - Ensure PostgreSQL is running on port 5435
   - Check database credentials in .env

2. **Keycloak Connection Error**
   - Verify Keycloak is accessible on port 9000
   - Check realm and client configuration
   - Make sure no other services are using port 9000

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

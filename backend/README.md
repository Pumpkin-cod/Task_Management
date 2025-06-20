# Task Management Backend

Backend API and services for the Task Management System.

## Features

- **Task API**: CRUD operations for tasks
- **User Management**: Authentication and authorization
- **Database Integration**: Task and user data persistence
- **API Documentation**: OpenAPI/Swagger specification

## Tech Stack

- [Backend Framework] - API server
- [Database] - Data storage
- [Authentication] - User management
- [API Documentation] - Swagger/OpenAPI

## Installation

```bash
# Install dependencies
[package manager install command]

# Set up environment variables
cp .env.example .env

# Run database migrations
[migration command]

# Start development server
[start command]
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Admin
- `GET /api/admin/tasks` - Get all tasks (admin)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/tasks/:id/assign` - Assign task to user

## Database Schema

### Tasks Table
```sql
- id (Primary Key)
- title (String)
- description (Text)
- status (Enum: pending, in_progress, completed)
- priority (Enum: low, medium, high)
- due_date (Date)
- assigned_to (Foreign Key: Users)
- created_by (Foreign Key: Users)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Users Table
```sql
- id (Primary Key)
- email (String, Unique)
- name (String)
- role (Enum: admin, member)
- created_at (Timestamp)
- updated_at (Timestamp)
```

## Environment Variables

```env
# Database
DATABASE_URL=your_database_url
DATABASE_NAME=task_management

# Authentication
JWT_SECRET=your_jwt_secret
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_client_id

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

## Development

```bash
# Start development server
[dev command]

# Run tests
[test command]

# Generate API documentation
[docs command]

# Database operations
[db:migrate]    # Run migrations
[db:seed]       # Seed database
[db:reset]      # Reset database
```

## API Documentation

Access API documentation at: `http://localhost:3000/api/docs`

## Testing

```bash
# Run all tests
[test command]

# Run specific test suite
[test:unit command]
[test:integration command]

# Test coverage
[test:coverage command]
```

## Deployment

```bash
# Build for production
[build command]

# Start production server
[start:prod command]
```

## Configuration Files

- `task-system.yaml` - API specification
- `.env` - Environment variables
- `[config file]` - Database configuration
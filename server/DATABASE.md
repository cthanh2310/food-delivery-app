# PostgreSQL Database Setup

This guide explains how to set up and use PostgreSQL with Docker for the Food Delivery application.

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed

## Quick Start

### 1. Start the Database

```bash
# Start PostgreSQL and pgAdmin containers
docker-compose up -d

# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f postgres
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Update the database password in `.env`:

```env
DB_PASSWORD=your_secure_password
```

### 3. Start the Server

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The server will automatically:

- Test the database connection on startup
- Display connection status in the console
- Close database connections gracefully on shutdown

## Database Access

### Using pgAdmin (Web Interface)

1. Open your browser and navigate to: `http://localhost:5050`
2. Login with credentials from `.env`:
    - Email: `admin@admin.com` (default)
    - Password: `admin` (default)
3. Add a new server:
    - Host: `postgres` (container name)
    - Port: `5432`
    - Database: `food_delivery`
    - Username: `postgres`
    - Password: (from your `.env` file)

### Using psql (Command Line)

```bash
# Connect to PostgreSQL container
docker exec -it food-delivery-db psql -U postgres -d food_delivery

# List all tables
\dt

# Describe a table
\d users

# Run a query
SELECT * FROM users;

# Exit
\q
```

## Database Schema

The initial schema includes a `users` table:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Health Check

```bash
GET /api/health
```

Returns server and database status.

### Get All Users

```bash
GET /api/users
```

Returns all users from the database.

### Get User by ID

```bash
GET /api/users/:id
```

Returns a specific user by ID.

## Database Connection Module

The application uses a singleton database connection pool located in `src/config/database.ts`.

### Basic Usage

```typescript
import { db } from "./config/database";

// Simple query
const result = await db.query("SELECT * FROM users");

// Query with parameters
const user = await db.query("SELECT * FROM users WHERE email = $1", [
    "user@example.com",
]);

// Transaction
await db.transaction(async (client) => {
    await client.query("INSERT INTO users (email) VALUES ($1)", [
        "test@example.com",
    ]);
    await client.query("INSERT INTO orders (user_id) VALUES ($1)", [1]);
    // Both queries will be committed together
});
```

## Docker Commands

### Stop Containers

```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ This will delete all data)

```bash
docker-compose down -v
```

### Restart Containers

```bash
docker-compose restart
```

### View Container Logs

```bash
# All containers
docker-compose logs -f

# Specific container
docker-compose logs -f postgres
docker-compose logs -f pgadmin
```

### Execute Commands in Container

```bash
# Open bash shell
docker exec -it food-delivery-db bash

# Run PostgreSQL commands
docker exec -it food-delivery-db psql -U postgres -d food_delivery -c "SELECT * FROM users;"
```

## Backup and Restore

### Backup Database

```bash
docker exec food-delivery-db pg_dump -U postgres food_delivery > backup.sql
```

### Restore Database

```bash
docker exec -i food-delivery-db psql -U postgres food_delivery < backup.sql
```

## Troubleshooting

### Connection Refused

- Ensure Docker containers are running: `docker-compose ps`
- Check if port 5432 is available: `lsof -i :5432`
- Verify environment variables in `.env`

### Database Not Found

- Check if the database was created: `docker-compose logs postgres`
- Recreate containers: `docker-compose down -v && docker-compose up -d`

### Permission Denied

- Ensure the `init-scripts` directory has proper permissions
- Check Docker volume permissions

## Environment Variables

| Variable           | Description                | Default           |
| ------------------ | -------------------------- | ----------------- |
| `DB_HOST`          | Database host              | `localhost`       |
| `DB_PORT`          | Database port              | `5432`            |
| `DB_NAME`          | Database name              | `food_delivery`   |
| `DB_USER`          | Database user              | `postgres`        |
| `DB_PASSWORD`      | Database password          | `postgres`        |
| `DB_POOL_MIN`      | Minimum pool connections   | `2`               |
| `DB_POOL_MAX`      | Maximum pool connections   | `10`              |
| `PGADMIN_EMAIL`    | pgAdmin login email        | `admin@admin.com` |
| `PGADMIN_PASSWORD` | pgAdmin login password     | `admin`           |
| `PGADMIN_PORT`     | pgAdmin web interface port | `5050`            |

## Production Considerations

1. **Security**:
    - Use strong passwords
    - Don't commit `.env` file to version control
    - Use environment-specific configurations
    - Enable SSL/TLS for database connections

2. **Performance**:
    - Adjust pool size based on load
    - Add database indexes for frequently queried columns
    - Monitor connection pool usage

3. **Monitoring**:
    - Set up database monitoring
    - Track query performance
    - Monitor connection pool metrics

4. **Backups**:
    - Implement automated backup strategy
    - Test restore procedures regularly
    - Store backups securely off-site

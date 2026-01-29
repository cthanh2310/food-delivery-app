# PostgreSQL Setup - Quick Reference

## 🚀 Quick Start

```bash
# 1. Start PostgreSQL with Docker
docker-compose up -d

# 2. Verify containers are running
docker-compose ps

# 3. Start the development server
npm run dev
```

## 📊 Access Points

- **API Server**: http://localhost:3000/api
- **pgAdmin**: http://localhost:5050
    - Email: `admin@admin.com`
    - Password: `admin`

## 🔍 Test Endpoints

```bash
# Health check (includes database status)
curl http://localhost:3000/api/health

# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1
```

## 🛠️ Common Commands

### Docker Management

```bash
# View logs
docker-compose logs -f postgres

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# Remove everything (including data)
docker-compose down -v
```

### Database Access

```bash
# Connect via psql
docker exec -it food-delivery-db psql -U postgres -d food_delivery

# Run a query directly
docker exec -it food-delivery-db psql -U postgres -d food_delivery -c "SELECT * FROM users;"

# Backup database
docker exec food-delivery-db pg_dump -U postgres food_delivery > backup.sql

# Restore database
docker exec -i food-delivery-db psql -U postgres food_delivery < backup.sql
```

## 📝 Database Connection in Code

```typescript
import { db } from "./config/database";

// Simple query
const users = await db.query("SELECT * FROM users");

// Query with parameters
const user = await db.query("SELECT * FROM users WHERE email = $1", [
    "user@example.com",
]);

// Transaction
await db.transaction(async (client) => {
    await client.query("INSERT INTO users (email) VALUES ($1)", [
        "test@example.com",
    ]);
    await client.query("UPDATE orders SET status = $1 WHERE user_id = $2", [
        "completed",
        1,
    ]);
});
```

## 🔧 Environment Variables

Key variables in `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=food_delivery
DB_USER=postgres
DB_PASSWORD=postgres
DB_POOL_MIN=2
DB_POOL_MAX=10
```

## 📚 Full Documentation

See [DATABASE.md](./DATABASE.md) for complete documentation including:

- Detailed setup instructions
- Schema information
- Troubleshooting guide
- Production considerations
- Backup and restore procedures

## ⚠️ Troubleshooting

### Database connection failed

```bash
# Check if containers are running
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Restart containers
docker-compose restart
```

### Port already in use

```bash
# Check what's using port 5432
lsof -i :5432

# Change port in .env and docker-compose.yml
DB_PORT=5433
```

### Reset database

```bash
# Stop and remove all data
docker-compose down -v

# Start fresh
docker-compose up -d
```

# 🚀 Setup Guide for New Developers

Welcome to the Food Delivery Backend project! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Docker** & **Docker Compose** - [Download](https://www.docker.com/products/docker-desktop)
- **Git** - [Download](https://git-scm.com/)

## Quick Start (Recommended)

For a fresh clone, run this single command:

```bash
npm run setup
```

This will:
1. ✅ Install all dependencies
2. ✅ Generate Prisma Client
3. ✅ Apply all database migrations
4. ✅ Seed the database with sample data

Then start the development server:

```bash
npm run dev
```

## Manual Setup (Step-by-Step)

If you prefer to understand each step or the quick setup fails:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd food-delivery-app/server
```

### 2. Install Dependencies

```bash
npm install
```

This will automatically run `prisma generate` via the `postinstall` hook.

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` if you need to change database credentials or other settings:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/food_delivery?schema=public"
PORT=3000
NODE_ENV=development
```

### 4. Start the Database

Make sure Docker is running, then:

```bash
docker compose up -d
```

This starts PostgreSQL in the background. Verify it's running:

```bash
docker compose ps
```

### 5. Run Database Migrations

**For Development (First Time Setup):**

```bash
npm run db:migrate
```

This command will:
- Create the database if it doesn't exist
- Apply all migrations from `prisma/migrations/`
- Generate Prisma Client types
- Update your database schema

**Alternative (if migrations already exist):**

```bash
npx prisma migrate dev
```

### 6. Seed the Database (Optional)

Add sample data for testing:

```bash
npm run db:seed
```

### 7. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📚 Understanding Database Migrations

### Development Workflow

When you're developing and need to change the database schema:

1. **Modify** `prisma/schema.prisma`
2. **Create and apply migration:**
   ```bash
   npm run db:migrate
   # You'll be prompted to name your migration
   ```
3. **Commit** both the schema and migration files to Git

### Production/CI Workflow

When deploying to production or in CI/CD:

```bash
npm run db:deploy
# or: npx prisma migrate deploy
```

This only applies existing migrations and won't create new ones.

### Key Differences

| Command | Environment | Creates Migrations | Applies Migrations | Generates Client |
|---------|-------------|-------------------|-------------------|------------------|
| `prisma migrate dev` | Development | ✅ Yes | ✅ Yes | ✅ Yes |
| `prisma migrate deploy` | Production/CI | ❌ No | ✅ Yes | ❌ No* |

*You need to run `prisma generate` separately in production

## 🛠️ Common Commands

### Database Management

```bash
# View database in browser
npm run db:studio

# Reset database (⚠️ deletes all data)
npm run db:reset

# Generate Prisma Client only
npm run db:generate

# Apply migrations (production)
npm run db:deploy
```

### Development

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### "No migration found in prisma/migrations"

**Problem:** You ran `prisma migrate deploy` but no migrations exist yet.

**Solution:** Use `npm run db:migrate` instead (for development).

### "Database does not exist"

**Problem:** PostgreSQL is not running or database wasn't created.

**Solution:**
```bash
# Make sure Docker is running
docker compose up -d

# Then run migrations
npm run db:migrate
```

### "Prisma Client is not generated"

**Problem:** Prisma Client types are missing.

**Solution:**
```bash
npm run db:generate
```

### "Port 3000 is already in use"

**Problem:** Another process is using port 3000.

**Solution:**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or change the port in .env
PORT=3001
```

### "Cannot connect to database"

**Problem:** Database credentials are incorrect or PostgreSQL isn't running.

**Solution:**
1. Check Docker: `docker compose ps`
2. Verify `.env` has correct `DATABASE_URL`
3. Restart database: `docker compose restart`

## 🔍 Verifying Your Setup

After setup, verify everything works:

1. **Check API Health:**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Check Database Connection:**
   ```bash
   npm run db:studio
   ```
   This should open Prisma Studio in your browser.

3. **Run Tests:**
   ```bash
   npm test
   ```

## 📖 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the main [README.md](./README.md)
3. Ask the team in Slack/Discord
4. Create an issue in the repository

---

**Happy Coding! 🎉**

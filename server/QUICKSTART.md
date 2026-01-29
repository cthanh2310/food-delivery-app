# Quick Start Guide

## 🚀 Running the Server

### Development Mode (with hot-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## 📋 Common Tasks

### Adding a New Route

1. Create a new route file in `src/routes/`:

```typescript
// src/routes/users.ts
import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
    res.json({ message: "Get all users" });
});

router.post("/", (req, res) => {
    const { name, email } = req.body;
    res.status(201).json({ message: "User created", data: { name, email } });
});

export default router;
```

2. Import and use in `src/routes/index.ts`:

```typescript
import userRoutes from "./users";

router.use("/users", userRoutes);
```

### Creating Custom Middleware

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization;

    if (!token) {
        throw new AppError("No token provided", 401);
    }

    // Verify token logic here
    next();
};
```

### Error Handling

Use the `AppError` class for operational errors:

```typescript
import { AppError } from "@/middleware/errorHandler";

// In your route handler
if (!user) {
    throw new AppError("User not found", 404);
}
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and update:

```bash
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=food_delivery
```

## 📦 Adding Dependencies

```bash
# Production dependency
npm install package-name

# Development dependency
npm install -D package-name
```

## 🧪 Testing Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# API info
curl http://localhost:3000/api

# POST request example
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

## 🎯 Next Steps

1. **Add Database**: Install and configure Prisma, TypeORM, or Sequelize
2. **Add Authentication**: Implement JWT authentication
3. **Add Validation**: Use Zod or Joi for request validation
4. **Add Testing**: Set up Jest for unit and integration tests
5. **Add Documentation**: Use Swagger/OpenAPI for API documentation

# Food Delivery API Documentation

## 📚 API Documentation

This API provides comprehensive endpoints for a food delivery application with menu browsing, cart management, and order tracking features.

### Access the Interactive Documentation

Once the server is running, you can access the interactive Swagger UI documentation at:

**🔗 http://localhost:3000/api-docs**

The Swagger UI provides:

- ✅ Complete API endpoint documentation
- ✅ Request/response schemas
- ✅ Interactive "Try it out" feature
- ✅ Example requests and responses
- ✅ Data model definitions

## 🚀 Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 2. Access the API Documentation

Open your browser and navigate to:

```
http://localhost:3000/api-docs
```

## 📋 API Endpoints Overview

### Health Check

- `GET /api/health` - Check API health status

### Menu & Categories

- `GET /api/menu` - Get all available menu items
- `GET /api/menu/:id` - Get a specific menu item
- `GET /api/categories` - Get all active categories

### Shopping Cart

- `POST /api/cart` - Add item to cart
- `GET /api/cart/:sessionId` - Get cart items
- `PUT /api/cart/:sessionId/:itemId` - Update cart item quantity
- `DELETE /api/cart/:sessionId/:itemId` - Remove item from cart
- `DELETE /api/cart/:sessionId` - Clear entire cart

### Orders

- `POST /api/orders` - Create a new order
- `GET /api/orders/:uuid` - Get order by UUID
- `GET /api/orders/session/:sessionId` - Get all orders for a session

### Order Status

- `GET /api/orders/:uuid/status` - Get order status with history
- `PUT /api/orders/:uuid/status` - Update order status (Admin)

## 🔑 Key Features

### Session-Based Cart

No authentication required. Use a session ID to manage cart items:

```bash
# Add item to cart
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "my-session-123",
    "menuItemId": 1,
    "quantity": 2
  }'
```

### Order Tracking

Track orders through their lifecycle:

- **PENDING** → Order Received
- **CONFIRMED** → Order Confirmed
- **PREPARING** → Preparing
- **OUT_FOR_DELIVERY** → Out for Delivery
- **DELIVERED** → Delivered
- **CANCELLED** → Cancelled

### Automatic Features

- ✅ Cart subtotal calculation
- ✅ Order total calculation (subtotal + delivery fee)
- ✅ Cart clearing after order placement
- ✅ Order item price snapshot
- ✅ Status history tracking
- ✅ Estimated delivery time

## 📊 Data Models

### MenuItem

```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Margherita Pizza",
  "description": "Classic pizza with fresh tomatoes and mozzarella",
  "price": 12.99,
  "imageUrl": "https://example.com/margherita.jpg",
  "isAvailable": true,
  "category": {
    "id": 1,
    "name": "Pizza",
    "description": "Delicious handcrafted pizzas"
  }
}
```

### Order

```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "sessionId": "session-123",
  "status": "PENDING",
  "subtotal": 25.98,
  "deliveryFee": 5.00,
  "totalAmount": 30.98,
  "customerName": "John Doe",
  "customerPhone": "555-1234",
  "deliveryAddress": "123 Main Street, City, 12345",
  "notes": "Please ring the doorbell",
  "orderItems": [...],
  "statusHistory": [...]
}
```

## 🧪 Testing

Run the test suite to verify all endpoints:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

**Test Results**: 46/46 tests passing ✅

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run test:coverage # Run tests with coverage
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with test data
npm run db:studio    # Open Prisma Studio
```

### Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/food_delivery"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
```

## 📝 Example Usage

### Complete Order Flow

```bash
# 1. Browse menu
curl http://localhost:3000/api/menu

# 2. Add items to cart
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-123",
    "menuItemId": 1,
    "quantity": 2
  }'

# 3. View cart
curl http://localhost:3000/api/cart/session-123

# 4. Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-123",
    "customerName": "John Doe",
    "customerPhone": "555-1234",
    "deliveryAddress": "123 Main St",
    "notes": "Ring doorbell"
  }'

# 5. Track order status
curl http://localhost:3000/api/orders/{order-uuid}/status
```

## 🔒 Security

- Helmet.js for security headers
- CORS configuration
- Input validation on all endpoints
- SQL injection prevention via Prisma ORM

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)

## 🤝 Support

For issues or questions, please refer to the main project README or open an issue on GitHub.

---

**Built with ❤️ using Express.js, TypeScript, Prisma, and PostgreSQL**

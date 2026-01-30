# Food Delivery Backend

## 1. How new team member can run locally

### Prerequisites

- Node.js (v18 or higher)
- Docker (optional, for running PostgreSQL) or a local PostgreSQL instance

### Installation & Setup

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Configure Environment**
    - Copy the example environment file:
      ```bash
      cp .env.example .env
      ```
    - Update `.env` with your database credentials (check `DATABASE_URL`).

3.  **Database Setup**
    - If using Docker, start the database:
      ```bash
      docker compose up -d
      ```
    - Run migrations to set up the schema:
      ```bash
      npm run db:migrate
      # or
      npx prisma migrate dev
      ```
    - (Optional) Seed the database with initial data:
      ```bash
      npm run db:seed
      ```

4.  **Run the Server**
    - Start in development mode with hot-reload:
      ```bash
      npm run dev
      ```
    - The server will be available at `http://localhost:3000`.
    - API Documentation (Swagger): `http://localhost:3000/api-docs`

## 3. Flow order in sequence (Order Processing Flow)

1.  **Browse Menu**
    - Endpoint: `GET /api/menu`
    - User views available categories and food items.

2.  **Add Items to Cart**
    - Endpoint: `POST /api/cart`
    - Items are added to a cart identified by a `sessionId` (client-generated).

3.  **View Cart**
    - Endpoint: `GET /api/cart/:sessionId`
    - User reviews their cart contents.

4.  **Create Order**
    - Endpoint: `POST /api/orders`
    - User submits the order with customer details and `sessionId`. The cart is cleared upon success.
    - Initial Status: `PENDING`.

5.  **Track Order Status**
    - Endpoint: `GET /api/orders/:uuid/status`
    - User and system track the lifecycle:
      `PENDING` -> `CONFIRMED` -> `PREPARING` -> `OUT_FOR_DELIVERY` -> `DELIVERED`

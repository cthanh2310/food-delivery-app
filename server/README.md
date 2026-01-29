# Food Delivery Backend API

A RESTful API built with Express and TypeScript for a food delivery application.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration

### Development

Run the development server with hot-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 📁 Project Structure

```
be/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── app.ts          # Express app setup
│   └── index.ts        # Server entry point
├── dist/               # Compiled JavaScript (generated)
├── .env.example        # Environment variables template
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

### Database Scripts (Prisma)

| Script             | Command                        | Description                                                  |
| ------------------ | ------------------------------ | ------------------------------------------------------------ |
| `yarn db:migrate`  | `prisma migrate dev`           | Create new migration after schema changes (development only) |
| `yarn db:generate` | `prisma generate`              | Generate Prisma Client types (run after `yarn install`)      |
| `yarn db:studio`   | `prisma studio`                | Open visual database editor in browser                       |
| `yarn db:seed`     | `ts-node prisma/seed.ts`       | Populate database with sample data                           |
| `yarn db:reset`    | `prisma migrate reset --force` | ⚠️ Drop all data and re-apply migrations                     |

#### For New Developers (after cloning):

```bash
docker-compose up -d              # Start PostgreSQL
npx prisma migrate deploy         # Apply existing migrations
npx prisma generate               # Generate TypeScript types
yarn db:seed                      # Add sample data (optional)
```

## 📝 API Endpoints

### Health Check

- `GET /api/health` - Check API status

### API Info

- `GET /api` - Get API information

## 🔧 Technologies

- **Express** - Web framework
- **TypeScript** - Type safety
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **dotenv** - Environment variables
- **ESLint** - Code linting
- **Nodemon** - Development auto-reload

## 📄 License

ISC

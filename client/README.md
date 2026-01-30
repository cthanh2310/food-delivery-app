# Food Delivery App - Client

A modern React application for food delivery, built with best practices and a scalable architecture.

## Tech Stack

- **React 19** - Latest React with concurrent features
- **React Router v6** - Client-side routing with nested layouts
- **TanStack Query (React Query)** - Server state management, caching, and synchronization
- **Zustand** - Lightweight client state management
- **React Hook Form + Zod** - Type-safe form handling with validation
- **Tailwind CSS v4** - Utility-first CSS framework
- **TypeScript** - Type safety throughout the codebase
- **Vite** - Fast development and optimized builds

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## Project Structure

```
src/
├── components/         # Reusable UI components
│   └── layout/         # Layout components (Header, Footer)
├── hooks/              # Custom React hooks
├── layouts/            # Page layouts
├── lib/                # Utilities and configurations
│   ├── api-client.ts   # API client wrapper
│   ├── query-client.ts # TanStack Query configuration
│   └── validations.ts  # Zod schemas for form validation
├── pages/              # Route pages
│   └── auth/           # Authentication pages
├── router/             # React Router configuration
├── stores/             # Zustand stores
│   ├── app.store.ts    # Global app state
│   └── cart.store.ts   # Shopping cart state
├── types/              # TypeScript type definitions
├── App.tsx             # App entry with providers
└── main.tsx            # React entry point
```

## Architecture Highlights

### State Management

- **Zustand** for client state (UI state, cart, authentication status)
- **TanStack Query** for server state (API data, caching, refetching)

### Form Handling

- **React Hook Form** for form state management
- **Zod** schemas for runtime validation
- **@hookform/resolvers** for integration

### Routing

- **React Router v6** with nested routes
- Layout-based routing with `Outlet`
- Separate layouts for main app and authentication

### Styling

- **Tailwind CSS v4** with CSS variables for theming
- Custom dark mode support
- Modern design with gradients and animations

## Environment Variables

| Variable            | Description     | Default                     |
| ------------------- | --------------- | --------------------------- |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000/api` |

## Best Practices Implemented

1. **Barrel exports** - Clean imports with index.ts files
2. **Path aliases** - Use `@/` for src directory
3. **Type safety** - Full TypeScript coverage
4. **Error handling** - Custom ApiError class
5. **Devtools** - React Query Devtools in development
6. **Persistence** - Cart and preferences stored in localStorage
7. **Responsive design** - Mobile-first approach
8. **Accessibility** - Focus states and semantic HTML

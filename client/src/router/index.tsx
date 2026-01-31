import { createBrowserRouter } from "react-router-dom";

// Layouts
import { RootLayout } from "@/layouts/RootLayout";

// Pages
import { HomePage } from "@/pages/Home";
import { NotFoundPage } from "@/pages/NotFound";
import { MenuPage } from "@/pages/Menu";
import { OrdersPage } from "@/pages/Orders";
import { OrderDetailPage } from "@/pages/OrderDetail";
import { PaymentSimulationPage } from "@/pages/PaymentSimulation";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                path: "payment-simulation",
                element: <PaymentSimulationPage />,
            },
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "restaurants",
                element: <MenuPage />,
            },
            // {
            //   path: 'restaurants/:id',
            //   element: <RestaurantDetailPage />,
            // },
            // {
            //   path: 'cart',
            //   element: <CartPage />,
            // },
            {
                path: "orders",
                element: <OrdersPage />,
            },
            {
                path: "orders/:id",
                element: <OrderDetailPage />,
            },
        ],
    },
]);

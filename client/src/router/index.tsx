import { createBrowserRouter } from "react-router-dom";

// Layouts
import { RootLayout } from "@/layouts/RootLayout";

// Pages
import { HomePage } from "@/pages/Home";
import { NotFoundPage } from "@/pages/NotFound";
import { MenuPage } from "@/pages/Menu";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFoundPage />,
        children: [
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
            // {
            //   path: 'orders',
            //   element: <OrdersPage />,
            // },
        ],
    },
]);

import { useSessionOrders } from "@/hooks/use-orders";
import { Order } from "@/types/api";
import { Loader2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function OrdersPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useSessionOrders({ page, limit: 10 });
    const navigate = useNavigate();

    const orders = (data?.data || []) as Order[];
    const meta = data?.meta;

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Your Orders
                    </h1>
                    <p className="text-muted-foreground">
                        View and track your recent orders.
                    </p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed gap-4">
                    <div className="rounded-full bg-muted p-4">
                        <Receipt className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="font-semibold text-lg">No orders yet</h3>
                        <p className="text-muted-foreground text-sm">
                            When you place an order, it will appear here.
                        </p>
                    </div>
                    <Button onClick={() => navigate("/restaurants")}>
                        Browse Menu
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => (
                        <Card key={order.uuid} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">
                                            Order #{order.uuid.slice(0, 8)}
                                        </CardTitle>
                                        <CardDescription>
                                            {format(
                                                new Date(order.createdAt),
                                                "MMM d, yyyy h:mm a",
                                            )}
                                        </CardDescription>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Items
                                        </span>
                                        <span>
                                            {order.orderItems?.length || 0}{" "}
                                            items
                                        </span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                        <span>Total</span>
                                        <span>
                                            $
                                            {Number(order.totalAmount).toFixed(
                                                2,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() =>
                                        navigate(`/orders/${order.uuid}`)
                                    }
                                >
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {meta && (meta.hasNextPage || meta.hasPreviousPage) && (
                <div className="flex justify-center gap-4 pt-8">
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={!meta.hasPreviousPage}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center text-sm font-medium">
                        Page {meta.page} of {meta.totalPages}
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!meta.hasNextPage}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const variants: Record<
        string,
        "default" | "secondary" | "destructive" | "outline"
    > = {
        PENDING: "secondary",
        CONFIRMED: "default",
        PREPARING: "default",
        OUT_FOR_DELIVERY: "default",
        DELIVERED: "outline",
        CANCELLED: "destructive",
    };

    const labels: Record<string, string> = {
        PENDING: "Pending",
        CONFIRMED: "Confirmed",
        PREPARING: "Preparing",
        OUT_FOR_DELIVERY: "Out for Delivery",
        DELIVERED: "Delivered",
        CANCELLED: "Cancelled",
    };

    return (
        <Badge variant={variants[status] || "outline"}>
            {labels[status] || status}
        </Badge>
    );
}

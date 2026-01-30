import { useOrder } from "@/hooks/use-orders";
import { Order } from "@/types/api";
import { Loader2, ArrowLeft, MapPin, Phone, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useOrder(id!);

    const order = data?.data as Order | undefined;

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="flex h-[50vh] w-full flex-col items-center justify-center text-center gap-4">
                <h2 className="text-2xl font-bold text-destructive">
                    Order not found
                </h2>
                <Button variant="outline" onClick={() => navigate("/orders")}>
                    Back to Orders
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-8 space-y-6 max-w-4xl">
            <Button
                variant="ghost"
                className="gap-2 -ml-2 text-muted-foreground"
                onClick={() => navigate("/orders")}
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
            </Button>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Order #{order.uuid.slice(0, 8)}
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4" />
                        Placed on{" "}
                        {format(
                            new Date(order.createdAt),
                            "MMM d, yyyy 'at' h:mm a",
                        )}
                    </p>
                </div>
                <StatusBadge
                    status={order.status}
                    className="text-lg px-4 py-1"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.orderItems?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                                {item.quantity}x
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {item.itemName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="font-medium">
                                            ${Number(item.subtotal).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-6" />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>
                                        ${Number(order.subtotal).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Delivery Fee</span>
                                    <span>
                                        ${Number(order.deliveryFee).toFixed(2)}
                                    </span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>
                                        ${Number(order.totalAmount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>Customer</span>
                                </div>
                                <p className="font-medium">
                                    {order.customerName}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span>Phone</span>
                                </div>
                                <p className="font-medium">
                                    {order.customerPhone}
                                </p>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>Delivery Address</span>
                                </div>
                                <p className="font-medium">
                                    {order.deliveryAddress}
                                </p>
                            </div>
                            {order.notes && (
                                <div className="space-y-1 sm:col-span-2 pt-2 border-t mt-2">
                                    <span className="text-sm text-muted-foreground">
                                        Notes
                                    </span>
                                    <p className="text-sm italic">
                                        "{order.notes}"
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l border-muted pl-6 space-y-6">
                                {order.statusHistory?.map(
                                    (history, index: number) => (
                                        <div
                                            key={history.id}
                                            className="relative"
                                        >
                                            <div
                                                className={`absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-background ${
                                                    index === 0
                                                        ? "bg-primary"
                                                        : "bg-muted-foreground"
                                                }`}
                                            />
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {history.status.replace(
                                                        /_/g,
                                                        " ",
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(
                                                        new Date(
                                                            history.createdAt,
                                                        ),
                                                        "MMM d, h:mm a",
                                                    )}
                                                </p>
                                                {history.notes && (
                                                    <p className="text-xs text-muted-foreground italic">
                                                        {history.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({
    status,
    className,
}: {
    status: string;
    className?: string;
}) {
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
        <Badge variant={variants[status] || "outline"} className={className}>
            {labels[status] || status}
        </Badge>
    );
}

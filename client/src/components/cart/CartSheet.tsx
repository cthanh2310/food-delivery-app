import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    useCart,
    useUpdateCartItem,
    useRemoveFromCart,
} from "@/hooks/use-cart";
import { ShoppingCart, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { CheckoutDialog } from "@/components/order/CheckoutDialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function CartSheet() {
    const { data: cartData, isLoading } = useCart();
    const updateItem = useUpdateCartItem();
    const removeItem = useRemoveFromCart();
    const [open, setOpen] = useState(false);

    const cart = cartData?.data;
    const items = cart?.items || [];
    const subtotal = cart?.subtotal || 0;
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        updateItem.mutate({ itemId, quantity: newQuantity });
    };

    const handleRemoveItem = (itemId: number) => {
        removeItem.mutate(itemId);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                            {totalItems > 9 ? "9+" : totalItems}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Your Cart
                        {totalItems > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {totalItems} items
                            </Badge>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <Separator className="my-4" />

                <div className="flex-1 overflow-y-auto px-4">
                    {isLoading ? (
                        <div className="flex h-40 items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-4 text-muted-foreground">
                            <ShoppingCart className="h-12 w-12 opacity-20" />
                            <p>Your cart is empty</p>
                            <Button
                                variant="link"
                                onClick={() => setOpen(false)}
                            >
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                                        {item.menuItem.imageUrl ? (
                                            <img
                                                src={item.menuItem.imageUrl}
                                                alt={item.menuItem.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-secondary">
                                                <span>🍽️</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <span className="font-medium line-clamp-2 text-sm">
                                                {item.menuItem.name}
                                            </span>
                                            <span className="font-semibold text-sm">
                                                $
                                                {(
                                                    parseFloat(
                                                        item.menuItem.price,
                                                    ) * item.quantity
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border rounded-md h-8">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-r-none"
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item.id,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <= 1 ||
                                                        updateItem.isPending
                                                    }
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-xs font-medium">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-l-none"
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item.id,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                    disabled={
                                                        updateItem.isPending
                                                    }
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() =>
                                                    handleRemoveItem(item.id)
                                                }
                                                disabled={removeItem.isPending}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t pt-4 px-4 space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Subtotal
                                </span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Delivery Fee
                                </span>
                                <span>$5.00</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${(subtotal + 5).toFixed(2)}</span>
                            </div>
                        </div>
                        <CheckoutDialog
                            sessionId={
                                cartData?.data?.items[0]?.sessionId || ""
                            }
                            onSuccess={() => setOpen(false)}
                        />
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

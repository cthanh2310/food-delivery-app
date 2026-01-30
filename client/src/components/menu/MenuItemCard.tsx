import { MenuItem } from "@/types/api";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddToCart } from "@/hooks/use-cart";
import { useState } from "react";
import { Loader2, Plus, Minus } from "lucide-react";

interface MenuItemCardProps {
    item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
    const [quantity, setQuantity] = useState(1);
    const addToCart = useAddToCart();

    const handleAddToCart = () => {
        addToCart.mutate(
            { menuItemId: item.id, quantity },
            {
                onSuccess: () => {
                    setQuantity(1);
                    // Optional: Show toast
                },
            },
        );
    };

    const increment = () => setQuantity((q) => q + 1);
    const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    const price = parseFloat(item.price);

    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 w-full bg-muted">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
                        <span className="text-4xl">🍽️</span>
                    </div>
                )}
                {!item.isAvailable && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Badge variant="destructive" className="text-lg">
                            Sold Out
                        </Badge>
                    </div>
                )}
            </div>

            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle
                        className="text-lg font-bold line-clamp-1"
                        title={item.name}
                    >
                        {item.name}
                    </CardTitle>
                    <span className="font-bold text-primary whitespace-nowrap">
                        ${price.toFixed(2)}
                    </span>
                </div>
                {item.category && (
                    <Badge variant="secondary" className="w-fit text-xs">
                        {item.category.name}
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="p-4 pt-2 flex-grow">
                <p
                    className="text-sm text-muted-foreground line-clamp-3"
                    title={item.description}
                >
                    {item.description}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
                <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center border rounded-md">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={decrement}
                            disabled={!item.isAvailable || addToCart.isPending}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                            {quantity}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={increment}
                            disabled={!item.isAvailable || addToCart.isPending}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    <Button
                        onClick={handleAddToCart}
                        className="flex-1"
                        disabled={!item.isAvailable || addToCart.isPending}
                    >
                        {addToCart.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Plus className="h-4 w-4 mr-2" />
                        )}
                        Add
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

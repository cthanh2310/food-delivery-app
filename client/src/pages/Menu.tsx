import { useMenuItems } from "@/hooks/use-menu";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function MenuPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useMenuItems({ page, limit: 12 });

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-[50vh] w-full flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-destructive">
                    Error loading menu
                </h2>
                <p className="text-muted-foreground">Please try again later.</p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </Button>
            </div>
        );
    }

    const menuItems = data?.data || [];
    const meta = data?.meta;

    return (
        <div className="container py-8 space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Our Menu
                    </h1>
                    <p className="text-muted-foreground">
                        Choose from our delicious selection of dishes.
                    </p>
                </div>
            </div>

            {menuItems.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                        <span className="text-4xl">🍽️</span>
                        <p className="mt-2 text-lg font-medium text-muted-foreground">
                            No menu items found
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {menuItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
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

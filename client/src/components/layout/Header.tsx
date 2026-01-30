import { Link, useLocation } from "react-router-dom";
import { User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/cart/CartSheet";

import { cn } from "@/lib/utils";

export function Header() {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity"
                >
                    <span className="text-2xl">🍔</span>
                    <span className="hidden sm:inline">FoodExpress</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link to="/">
                        <Button
                            variant="ghost"
                            className={cn(
                                "text-base font-medium",
                                isActive("/")
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                            )}
                        >
                            Home
                        </Button>
                    </Link>
                    <Link to="/restaurants">
                        <Button
                            variant="ghost"
                            className={cn(
                                "text-base font-medium",
                                isActive("/restaurants")
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                            )}
                        >
                            Restaurants
                        </Button>
                    </Link>
                    <Link to="/orders">
                        <Button
                            variant="ghost"
                            className={cn(
                                "text-base font-medium",
                                isActive("/orders")
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                            )}
                        >
                            My Orders
                        </Button>
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Cart Sheet */}
                    <CartSheet />

                    {/* User Profile */}
                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                    </Button>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <nav className="flex flex-col gap-4 mt-8">
                                    <Link
                                        to="/"
                                        className={cn(
                                            "text-lg font-medium",
                                            isActive("/")
                                                ? "text-foreground"
                                                : "text-muted-foreground",
                                        )}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        to="/restaurants"
                                        className={cn(
                                            "text-lg font-medium",
                                            isActive("/restaurants")
                                                ? "text-foreground"
                                                : "text-muted-foreground",
                                        )}
                                    >
                                        Restaurants
                                    </Link>
                                    <Link
                                        to="/orders"
                                        className={cn(
                                            "text-lg font-medium",
                                            isActive("/orders")
                                                ? "text-foreground"
                                                : "text-muted-foreground",
                                        )}
                                    >
                                        My Orders
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="text-center space-y-6">
                <div className="text-8xl animate-bounce">🍕</div>
                <div className="space-y-2">
                    <h1 className="text-6xl font-bold text-foreground">404</h1>
                    <h2 className="text-2xl font-semibold text-muted-foreground">
                        Page Not Found
                    </h2>
                </div>
                <p className="text-muted-foreground max-w-md mx-auto text-lg">
                    Oops! Looks like this page got lost on the way to delivery.
                    Let's get you back to ordering delicious food.
                </p>
                <Link to="/">
                    <Button
                        size="lg"
                        className="px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none shadow-lg"
                    >
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}

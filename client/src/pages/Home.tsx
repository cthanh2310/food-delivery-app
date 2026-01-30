import { Link } from "react-router-dom";
import { Zap, Star, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

                <div className="container relative py-24 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left space-y-8">
                            <Badge
                                variant="secondary"
                                className="px-4 py-2 text-sm font-medium bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-none animate-pulse"
                            >
                                🔥 Fast Delivery in 30 mins
                            </Badge>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                                Delicious Food,
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                    Delivered Fast
                                </span>
                            </h1>
                            <p className="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0">
                                Order from the best local restaurants with easy,
                                on-demand delivery. Fresh ingredients, amazing
                                flavors, right at your doorstep.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/restaurants">
                                    <Button
                                        size="lg"
                                        className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none shadow-lg hover:shadow-orange-500/25"
                                    >
                                        Order Now
                                    </Button>
                                </Link>
                                <Link to="/about">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-14 px-8 text-lg font-semibold bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
                                    >
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full opacity-20 blur-3xl"></div>
                            <Card className="relative bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600/50 shadow-2xl">
                                <CardContent className="p-8">
                                    <div className="text-8xl text-center mb-6">
                                        🍕🍔🍜
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-orange-400">
                                                500+
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                Restaurants
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-orange-400">
                                                10k+
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                Happy Users
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-orange-400">
                                                30min
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                Avg Delivery
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-background">
                <div className="container">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                            Why Choose FoodExpress?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We bring the best of local restaurants to your
                            doorstep with unmatched quality and speed.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <Card className="group hover:border-orange-200 hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform">
                                    <Zap className="h-7 w-7" />
                                </div>
                                <CardTitle className="text-xl">
                                    Lightning Fast
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Average delivery time of 30 minutes. Track
                                    your order in real-time from kitchen to
                                    doorstep.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 2 */}
                        <Card className="group hover:border-orange-200 hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform">
                                    <Star className="h-7 w-7" />
                                </div>
                                <CardTitle className="text-xl">
                                    Premium Quality
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Partnered with top-rated restaurants to
                                    ensure every meal meets the highest
                                    standards.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 3 */}
                        <Card className="group hover:border-orange-200 hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform">
                                    <DollarSign className="h-7 w-7" />
                                </div>
                                <CardTitle className="text-xl">
                                    Best Prices
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Exclusive deals and discounts. No hidden
                                    fees, transparent pricing on every order.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary">
                <div className="container text-center space-y-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                        Ready to order?
                    </h2>
                    <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                        Join thousands of happy customers enjoying fresh,
                        delicious meals delivered daily.
                    </p>
                    <Link to="/restaurants">
                        <Button
                            size="lg"
                            className="h-14 px-8 text-lg font-bold bg-background text-primary hover:bg-background/90 shadow-lg"
                        >
                            Get Started
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

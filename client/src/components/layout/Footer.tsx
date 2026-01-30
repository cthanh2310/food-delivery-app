import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-50">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-xl font-bold"
                        >
                            <span className="text-2xl">🍔</span>
                            FoodExpress
                        </Link>
                        <p className="text-slate-400 max-w-md">
                            Delivering delicious meals from your favorite
                            restaurants right to your doorstep. Fast, fresh, and
                            always on time.
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-primary hover:text-primary-foreground rounded-full"
                            >
                                <Facebook className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-primary hover:text-primary-foreground rounded-full"
                            >
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-primary hover:text-primary-foreground rounded-full"
                            >
                                <Instagram className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/restaurants"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    Restaurants
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/orders"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    Track Order
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/help"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/faq"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/privacy"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terms"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 bg-slate-800" />

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm">
                        © 2026 FoodExpress. All rights reserved.
                    </p>
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-1 text-slate-400 bg-slate-800 px-2 py-1 rounded">
                            <CreditCard className="h-4 w-4" />
                            <span className="text-xs font-medium">VISA</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 bg-slate-800 px-2 py-1 rounded">
                            <CreditCard className="h-4 w-4" />
                            <span className="text-xs font-medium">
                                MasterCard
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 bg-slate-800 px-2 py-1 rounded">
                            <CreditCard className="h-4 w-4" />
                            <span className="text-xs font-medium">PayPal</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

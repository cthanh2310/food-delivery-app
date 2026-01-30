import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOrder } from "@/hooks/use-orders";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CheckoutFormValues {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    notes?: string;
}

interface CheckoutDialogProps {
    sessionId: string;
    onSuccess?: () => void;
}

export function CheckoutDialog({ onSuccess }: CheckoutDialogProps) {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CheckoutFormValues>();
    const createOrder = useCreateOrder();
    const navigate = useNavigate();

    const onSubmit = (data: CheckoutFormValues) => {
        createOrder.mutate(data, {
            onSuccess: (data) => {
                toast.success("Order placed successfully!");
                setOpen(false);
                reset();
                onSuccess?.();
                if (data?.data?.uuid) {
                    navigate(`/orders/${data.data.uuid}`);
                }
            },
            onError: (error) => {
                toast.error(error.message || "Failed to place order");
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                    Checkout
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                    <DialogDescription>
                        Enter your details to place the order.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-4 py-4"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            {...register("customerName", {
                                required: "Name is required",
                            })}
                        />
                        {errors.customerName && (
                            <span className="text-xs text-destructive">
                                {errors.customerName.message}
                            </span>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            {...register("customerPhone", {
                                required: "Phone is required",
                            })}
                        />
                        {errors.customerPhone && (
                            <span className="text-xs text-destructive">
                                {errors.customerPhone.message}
                            </span>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            {...register("deliveryAddress", {
                                required: "Address is required",
                            })}
                        />
                        {errors.deliveryAddress && (
                            <span className="text-xs text-destructive">
                                {errors.deliveryAddress.message}
                            </span>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea id="notes" {...register("notes")} />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={createOrder.isPending}>
                            {createOrder.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Place Order
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

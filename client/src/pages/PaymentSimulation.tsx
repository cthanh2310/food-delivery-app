import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib";
import { Loader2 } from "lucide-react";

export function PaymentSimulationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const code = searchParams.get("code");

  const handlePayment = async (success: boolean, note?: string) => {
    try {
      setLoading(true);
      await apiClient.post("/payment/simulate-webhook", {
        orderId: Number(orderId),
        success,
        note,
      });

      if (success) {
        toast.success("Payment successful!");
        // Snall delay to show success state before redirect
        setTimeout(() => {
            navigate(`/orders/${code}`);
        }, 500);
      } else {
        toast.info("Transaction cancelled");
        navigate(`/orders/${code}`);
      }
    } catch (error) {
      console.error("Payment simulation error:", error);
      toast.error("An error occurred during payment simulation");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countdown > 0 && !loading) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !loading) {
      // Auto cancel on timeout
      handlePayment(false, "Payment timeout (Simulation)");
    }
  }, [countdown, loading]);

  if (!orderId || !amount) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Invalid Request</CardTitle>
            <CardDescription>Missing order details</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/")} className="w-full">
              Go Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Format countdown as MM:SS
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="text-center border-b pb-6">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">💳</span>
          </div>
          <CardTitle>Payment Gateway (Simulated)</CardTitle>
          <CardDescription>
            This is a simulation environment for testing payment flows.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4 flex flex-col items-center">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">Scan QR to pay</p>
            <div className="p-4 bg-white border-2 border-gray-100 rounded-xl shadow-sm inline-block">
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SIMULATED_PAYMENT_${orderId}`} 
                 alt="Payment QR Code" 
                 className="w-48 h-48"
               />
            </div>
          </div>
          
          <div className="flex justify-between items-center w-full p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-bold text-green-600 text-lg">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(amount))}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 py-4">
             <div className="text-3xl font-mono font-bold text-primary">
                {formattedTime}
             </div>
             <p className="text-sm text-muted-foreground">
                Time remaining to pay
             </p>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 h-10 text-base"
            onClick={() => handlePayment(true)}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Simulate Successful Payment"
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handlePayment(false, "User cancelled payment simulation")}
            disabled={loading}
          >
            Cancel Transaction
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

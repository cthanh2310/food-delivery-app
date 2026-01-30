import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/lib/api-client";
import { getSessionId } from "@/lib/session";

export function useCreateOrder() {
    const queryClient = useQueryClient();
    const sessionId = getSessionId();

    return useMutation({
        mutationFn: (data: {
            customerName: string;
            customerPhone: string;
            deliveryAddress: string;
            notes?: string;
        }) => orderApi.create({ ...data, sessionId }),
        onSuccess: () => {
            // Invalidate cart since it's cleared on order creation
            queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
            queryClient.invalidateQueries({ queryKey: ["orders", sessionId] });
        },
    });
}

export function useSessionOrders(params?: { page?: number; limit?: number }) {
    const sessionId = getSessionId();
    return useQuery({
        queryKey: ["orders", sessionId, params],
        queryFn: () => orderApi.getSessionOrders(sessionId, params),
    });
}

export function useOrder(uuid: string) {
    return useQuery({
        queryKey: ["order", uuid],
        queryFn: () => orderApi.getOne(uuid),
        enabled: !!uuid,
    });
}

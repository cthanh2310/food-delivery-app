import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api-client";
import { getSessionId } from "@/lib/session";

export function useCart() {
    const sessionId = getSessionId();

    return useQuery({
        queryKey: ["cart", sessionId],
        queryFn: () => cartApi.get(sessionId),
    });
}

export function useAddToCart() {
    const queryClient = useQueryClient();
    const sessionId = getSessionId();

    return useMutation({
        mutationFn: ({
            menuItemId,
            quantity,
        }: {
            menuItemId: number;
            quantity: number;
        }) => cartApi.add(sessionId, menuItemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
        },
    });
}

export function useUpdateCartItem() {
    const queryClient = useQueryClient();
    const sessionId = getSessionId();

    return useMutation({
        mutationFn: ({
            itemId,
            quantity,
        }: {
            itemId: number;
            quantity: number;
        }) => cartApi.update(sessionId, itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
        },
    });
}

export function useRemoveFromCart() {
    const queryClient = useQueryClient();
    const sessionId = getSessionId();

    return useMutation({
        mutationFn: (itemId: number) => cartApi.remove(sessionId, itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
        },
    });
}

export function useClearCart() {
    const queryClient = useQueryClient();
    const sessionId = getSessionId();

    return useMutation({
        mutationFn: () => cartApi.clear(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
        },
    });
}

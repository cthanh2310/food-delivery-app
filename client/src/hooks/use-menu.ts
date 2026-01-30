import { useQuery } from "@tanstack/react-query";
import { menuApi } from "@/lib/api-client";

export function useMenuItems(params?: { page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["menu", params],
        queryFn: () => menuApi.getAll(params),
    });
}

export function useMenuItem(id: number) {
    return useQuery({
        queryKey: ["menu", id],
        queryFn: () => menuApi.getOne(id),
        enabled: !!id,
    });
}

import { Request, Response } from "express";
import { OrdersService } from "../services/orders.service";
import { OrderStatus } from "@prisma/client";
import {
  parsePaginationParams,
  createPaginatedResponse,
} from "../utils/pagination";

// Helper function to get status display text
function getStatusText(status: OrderStatus): string {
  const statusMap: Record<OrderStatus, string> = {
    PENDING: "Order Received",
    CONFIRMED: "Order Confirmed",
    PREPARING: "Preparing",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };
  return statusMap[status];
}

// Helper function to get estimated time
function getEstimatedMinutes(status: OrderStatus): number | null {
  const estimateMap: Record<OrderStatus, number | null> = {
    PENDING: 30,
    CONFIRMED: 25,
    PREPARING: 20,
    OUT_FOR_DELIVERY: 15,
    DELIVERED: null,
    CANCELLED: null,
  };
  return estimateMap[status];
}

export class OrdersController {
  static async createOrder(req: Request, res: Response) {
    try {
      const { sessionId, customerName, customerPhone, deliveryAddress, notes } =
        req.body;

      // Validation
      if (!sessionId || !customerName || !customerPhone || !deliveryAddress) {
        res.status(400).json({
          success: false,
          error:
            "Missing required fields: sessionId, customerName, customerPhone, deliveryAddress",
        });
        return;
      }

      if (!customerName.trim()) {
        res.status(400).json({
          success: false,
          error: "Customer name is required",
        });
        return;
      }

      if (!customerPhone.trim()) {
        res.status(400).json({
          success: false,
          error: "Customer phone is required",
        });
        return;
      }

      if (!deliveryAddress.trim()) {
        res.status(400).json({
          success: false,
          error: "Delivery address is required",
        });
        return;
      }

      const { order, checkoutUrl } = await OrdersService.createOrder({
        sessionId,
        customerName,
        customerPhone,
        deliveryAddress,
        notes,
      });

      res.status(201).json({
        success: true,
        data: order,
        checkoutUrl,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      if (
        error instanceof Error &&
        error.message === "Cannot create order with empty cart"
      ) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getOrderByUuid(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      const order = await OrdersService.getOrderByUuid(uuid);

      if (!order) {
        res.status(404).json({
          success: false,
          error: "Order not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getOrdersBySession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const { page, limit, skip } = parsePaginationParams(req.query);

      const { orders, total } = await OrdersService.getOrdersBySession(
        sessionId,
        { skip, limit },
      );

      res.status(200).json(createPaginatedResponse(orders, page, limit, total));
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getOrderStatus(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      const order = await OrdersService.getOrderStatus(uuid);

      if (!order) {
        res.status(404).json({
          success: false,
          error: "Order not found",
        });
        return;
      }

      const statusText = getStatusText(order.status);
      const estimatedMinutes = getEstimatedMinutes(order.status);

      res.status(200).json({
        success: true,
        data: {
          status: order.status,
          statusText,
          estimatedMinutes,
          history: order.statusHistory,
        },
      });
    } catch (error) {
      console.error("Error fetching order status:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      const { status, notes } = req.body;

      const validStatuses: OrderStatus[] = [
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ];

      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
        return;
      }

      const order = await OrdersService.updateOrderStatus(uuid, status, notes);

      if (!order) {
        res.status(404).json({
          success: false,
          error: "Order not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

export class CartController {
  static async addToCart(req: Request, res: Response) {
    try {
      const { sessionId, menuItemId, quantity } = req.body;

      // Validation
      if (!sessionId || !menuItemId || quantity === undefined) {
        res.status(400).json({
          success: false,
          error: "Missing required fields: sessionId, menuItemId, quantity",
        });
        return;
      }

      if (quantity < 1) {
        res.status(400).json({
          success: false,
          error: "Quantity must be at least 1",
        });
        return;
      }

      const { item, isNew } = await CartService.addToCart({
        sessionId,
        menuItemId,
        quantity,
      });

      res.status(isNew ? 201 : 200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (
        errorMessage === "Menu item not found" ||
        errorMessage === "Menu item is not available"
      ) {
        res.status(400).json({
          success: false,
          error: errorMessage,
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  static async getCart(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const data = await CartService.getCart(sessionId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async updateCartItem(req: Request, res: Response) {
    try {
      const { sessionId, itemId } = req.params;
      const { quantity } = req.body;

      if (quantity < 1) {
        res.status(400).json({
          success: false,
          error: "Quantity must be at least 1",
        });
        return;
      }

      const updatedItem = await CartService.updateCartItemDuration(
        sessionId,
        itemId,
        quantity,
      );

      res.status(200).json({
        success: true,
        data: updatedItem,
      });
    } catch (error) {
      console.error("Error updating cart item:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (errorMessage === "Invalid cart item ID") {
        res.status(400).json({
          success: false,
          error: errorMessage,
        });
        return;
      }
      if (errorMessage === "Cart item not found") {
        res.status(404).json({
          success: false,
          error: errorMessage,
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  static async removeCartItem(req: Request, res: Response) {
    try {
      const { sessionId, itemId } = req.params;

      await CartService.removeFromCart(sessionId, itemId);

      res.status(200).json({
        success: true,
        message: "Item removed from cart",
      });
    } catch (error) {
      console.error("Error removing cart item:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (errorMessage === "Invalid cart item ID") {
        res.status(400).json({
          success: false,
          error: errorMessage,
        });
        return;
      }
      if (errorMessage === "Cart item not found") {
        res.status(404).json({
          success: false,
          error: errorMessage,
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  static async clearCart(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;

      await CartService.clearCart(sessionId);

      res.status(200).json({
        success: true,
        message: "Cart cleared",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

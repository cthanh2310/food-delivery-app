import { Request, Response } from "express";
import { MenuService } from "../services/menu.service";
import {
  parsePaginationParams,
  createPaginatedResponse,
} from "../utils/pagination";

export class MenuController {
  static async getMenuItems(req: Request, res: Response) {
    try {
      const { page, limit, skip } = parsePaginationParams(req.query);

      const { menuItems, total } = await MenuService.getMenuItems({
        skip,
        limit,
      });

      res
        .status(200)
        .json(createPaginatedResponse(menuItems, page, limit, total));
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getMenuItemById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const menuItemId = parseInt(id);

      if (isNaN(menuItemId)) {
        res.status(400).json({
          success: false,
          error: "Invalid menu item ID",
        });
        return;
      }

      const menuItem = await MenuService.getMenuItemById(menuItemId);

      if (!menuItem) {
        res.status(404).json({
          success: false,
          error: "Menu item not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: menuItem,
      });
    } catch (error) {
      console.error("Error fetching menu item:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

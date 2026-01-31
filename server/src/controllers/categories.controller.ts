import { Request, Response } from "express";
import { CategoriesService } from "../services/categories.service";

export class CategoriesController {
  static async getCategories(_req: Request, res: Response) {
    try {
      const categories = await CategoriesService.getCategories();

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

import { prisma } from "../config/prisma";

export class CategoriesService {
  static async getCategories() {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      include: {
        _count: {
          select: {
            menuItems: true,
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return categories;
  }
}

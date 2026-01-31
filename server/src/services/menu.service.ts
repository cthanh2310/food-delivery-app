import { prisma } from "../config/prisma";

export class MenuService {
  static async getMenuItems(pagination: { skip: number; limit: number }) {
    // Get total count for pagination
    const total = await prisma.menuItem.count({
      where: {
        isAvailable: true,
      },
    });

    // Get paginated menu items
    const menuItems = await prisma.menuItem.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      skip: pagination.skip,
      take: pagination.limit,
    });

    return { menuItems, total };
  }

  static async getMenuItemById(id: number) {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
    return menuItem;
  }
}

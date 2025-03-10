const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      await prisma.foodSize.create({
        data: {
          foodCategoryId: req.body.foodCategoryId,
          name: req.body.foodSizeName,
          remark: req.body.foodSizeRemark || "",
          moneyAdded: req.body.moneyAdd,
        },
      });

      return res.send({ message : "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  list: async (req, res) => {
    try {
      const results = await prisma.foodSize.findMany({
        include: {
          FoodCategories: true,
        },
        where: {
          status: "use",
        },
        orderBy: {
          id: "desc",
        },
      });
      return res.send({ results : results });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  remove: async (req, res) => {
    try {
      await prisma.foodSize.update({
        data: {
          status: "delete",
        },
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await prisma.foodSize.update({
        data: {
          foodCategoryId: parseInt(req.body.foodCategoriesId),
          name: req.body.foodSizeName,
          remark: req.body.foodSizeRemark || "",
          moneyAdded: req.body.moneyAdd,
        },
        where: {
          id: parseInt(req.body.foodSizeId),
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};

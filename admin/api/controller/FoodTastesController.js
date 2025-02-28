const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  list: async (req, res) => {
    try {
      const results = await prisma.taste.findMany({
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
  create: async (req, res) => {
    try {
      await prisma.taste.create({
        data: {
          foodCategoryId: req.body.foodCategoryId,
          name: req.body.foodTasteName,
          remark: req.body.foodTasteRemark || "",
        },
      });
      return res.send({ message : "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  remove: async (req, res) => {
    try {
      await prisma.taste.update({
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
      await prisma.taste.update({
        data: {
          name: req.body.foodTasteName,
          remark: req.body.foodTasteRemark || "",
        },
        where: {
          id: parseInt(req.body.foodTasteId),
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};

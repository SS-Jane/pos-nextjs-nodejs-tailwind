const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      if (!req.body.categoriesName) {
        return res.status(400).send({ error: "Category name is required" });
      }

      await prisma.foodCategories.create({
        data: {
          name: req.body.categoriesName,
          remark: req.body.categoriesRemark || "",
          status: "use",
        },
      });

      return res.send({ message : "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  list: async (req, res) => {
    try {
      const rows = await prisma.foodCategories.findMany({
        where: {
          status: "use",
        },
        orderBy: {
          id: "desc",
        },
      });
      return res.send({ results : rows });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  remove: async (req, res) => {
    try {
      await prisma.foodCategories.update({
        data: {
          status: "delete",
        },
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.send({ message : "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await prisma.foodCategories.update({
        data: {
          name: req.body.categoriesName,
          remark: req.body.categoriesRemark || "",
        },
        where: {
          id: req.body.id,
        },
      });

      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};

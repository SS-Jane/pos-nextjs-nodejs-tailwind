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

      return res.send({ message: "success" });
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
      return res.send({ result: rows });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
        if (!req.body.userId || !req.body.tableNumber || !req.body.foodId) {
            return res.status(400).send({ error: "Missing required fields" });
          }

      const saleTemp = await prisma.saleTemp.create({
        data: {
          userId: parseInt(req.body.userId),
          tableNumber: parseInt(req.body.tableNumber),
        },
      });
      if (!saleTemp) {
      console.error("Failed to create saleTamp");
      return res.status(500).send({ error: "Database error" });
      }

      await prisma.saleTempDetail.create({
        data: {
          saleTempId: saleTemp.id,
          foodId: req.body.foodId,
          tasteId: req.body.tasteId,
          foodSizeId: req.body.foodSizeId,
        },
      });

      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};

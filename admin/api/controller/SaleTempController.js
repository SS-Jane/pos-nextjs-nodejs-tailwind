const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      if (!req.body.userId || !req.body.tableNumber || !req.body.foodId) {
        return res.status(400).send({ error: "Missing required fields" });
      }

      const rowSaleTemp = await prisma.saleTemp.findFirst({
        where: {
          userId: req.body.userId,
          tableNumber: req.body.TableNumber,
        },
      });

      let saleTempId = 0;

      if (!rowSaleTemp) {
        const saleTemp = await prisma.saleTemp.create({
          data: {
            userId: parseInt(req.body.userId),
            tableNumber: parseInt(req.body.tableNumber),
          },
        });
        saleTempId = saleTemp.id;
      } else {
        saleTempId = rowSaleTemp.id;
      }

      if (!saleTempId) {
        console.error("Failed to create saleTemp");
        return res.status(500).send({ error: "Database error" });
      }

      const results = await prisma.saleTempDetail.create({
        data: {
          saleTempId: saleTempId,
          foodId: req.body.foodId,
          tasteId: req.body.tasteId || null,
          foodSizeId: req.body.foodSizeId || null,
        },
      });

      return res.send({ message: "success", results : results  });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  list: async (req, res) => {
    try {
      const saleTemps = await prisma.saleTemp.findMany({
        include: {
          SaleTempDetails: {
            include: {
              Food: true,
              Taste: true,
              FoodSize: true,
            },
          },
        },
      });
      return res.send({ results: saleTemps });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};

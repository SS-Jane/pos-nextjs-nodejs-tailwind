const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      if (!req.body.userId || !req.body.tableNumber || !req.body.foodId) {
        return res.status(400).send({ error: "Missing required fields" });
      }

      let saleTempId = 0;

      const rowSaleTemp = await prisma.saleTemp.findFirst({
        where: {
          userId: req.body.userId,
          tableNumber: req.body.tableNumber,
          foodId: req.body.foodId,
        },
      });

      if (!rowSaleTemp) {
        const createdSaleTemp = await prisma.saleTemp.create({
          data: {
            userId: parseInt(req.body.userId),
            tableNumber: parseInt(req.body.tableNumber),
            foodId: parseInt(req.body.foodId),
            qty: 1,
          },
        });

        saleTempId = createdSaleTemp.id;
      } else {
        const updatedSaleTemp = await prisma.saleTemp.update({
          where: {
            id: rowSaleTemp.id,
          },
          data: {
            qty: rowSaleTemp.qty + 1,
          },
        });
        saleTempId = updatedSaleTemp.id;
      }

      if (!saleTempId) {
        console.error("Failed to create saleTemp");
        return res.status(500).send({ error: "Database error" });
      }

      return res.send({ message: "success" });
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
          Food: true,
        },
        orderBy: {
          id: "desc",
        },
      });
      return res.send({ results: saleTemps });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  remove: async (req, res) => {
    try {
      await prisma.saleTemp.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  removeAll: async (req, res) => {
    try {
      const saleTemps = await prisma.saleTemp.findMany({
        where: {
          userId: parseInt(req.body.userId),
          tableNumber: parseInt(req.body.tableNumber),
        },
        select: { id: true },
      });

      const saleTempIds = saleTemps.map((st) => st.id);

      if (saleTempIds.length === 0) {
        return res.send({ message: "No records found" });
      }

      await prisma.saleTempDetail.deleteMany({
        where: {
          saleTempId: { in: saleTempIds },
        },
      });

      await prisma.saleTemp.deleteMany({
        where: {
          id: { in: saleTempIds },
        },
      });

      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  updateQty: async (req, res) => {
    try {
      await prisma.saleTemp.update({
        where: {
          id: req.body.id,
        },
        data: {
          qty: req.body.qty,
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};

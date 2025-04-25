const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  list: async (req, res) => {
    try {
      const billSale = await prisma.billSale.findMany({
        where: {
          createdDate: {
            gte: req.body.startDate,
            lte: req.body.endDate,
          },
          status: "use",
        },
        include: {
          BillSaleDetails: {
            include : {
              Food : true,
              FoodSize : true,
              Taste : true,
            }
          },
          User: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      return res.send({ results: billSale });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  remove: async (req, res) => {
    try {
      await prisma.billSale.update({
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
};

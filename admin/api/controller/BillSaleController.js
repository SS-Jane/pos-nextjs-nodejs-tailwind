const { PrismaClient } = require("@prisma/client");
const dayjs = require("dayjs");
const { end } = require("pdfkit");
const prisma = new PrismaClient();

module.exports = {
  list: async (req, res) => {
    try {

      const startDate = dayjs(req.body.startDate).set('hour', 0).set('minute',0).set('second',0).toDate();
      const endDate = dayjs(req.body.endDate).set('hour', 23).set('minute', 59).set('second', 59).toDate();

      const billSale = await prisma.billSale.findMany({
        where: {
          createdDate: {
            gte: startDate,
            lte: endDate,
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

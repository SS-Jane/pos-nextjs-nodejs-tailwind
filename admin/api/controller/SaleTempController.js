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
        include: {
          SaleTempDetails: true,
        },
      });

      if (!rowSaleTemp) {
        const createdSaleTemp = await prisma.saleTemp.create({
          data: {
            userId: req.body.userId,
            tableNumber: req.body.tableNumber,
            foodId: req.body.foodId,
            qty: 1,
          },
        });

        saleTempId = createdSaleTemp.id;

        if (!saleTempId) {
          console.error("Failed to create saleTemp");
          return res.status(500).send({ error: "Database error" });
        }
      } else {
        if (rowSaleTemp.SaleTempDetails.length === 0) {
          const updatedSaleTemp = await prisma.saleTemp.update({
            where: {
              id: rowSaleTemp.id,
            },
            data: {
              qty: rowSaleTemp.qty + 1,
            },
          });
          saleTempId = updatedSaleTemp.id;

          if (!saleTempId) {
            console.error("Failed to update saleTemp");
            return res.status(500).send({ error: "Database error" });
          }
        }
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
      const saleTempId = parseInt(req.params.id);

      await prisma.saleTempDetail.deleteMany({
        where: {
          saleTempId: saleTempId,
        },
      });

      await prisma.saleTemp.delete({
        where: {
          id: saleTempId,
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
          userId: req.body.userId,
          tableNumber: req.body.tableNumber,
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
  generateSaleTempDetail: async (req, res) => {
    try {
      const saleTemp = await prisma.saleTemp.findFirst({
        where: {
          id: req.body.saleTempId,
        },
        include: {
          SaleTempDetails: true,
        },
      });

      if (saleTemp.SaleTempDetails.length === 0) {
        for (let i = 0; i < saleTemp.qty; i++) {
          await prisma.saleTempDetail.create({
            data: {
              saleTempId: saleTemp.id,
              foodId: saleTemp.foodId,
            },
          });
        }
      }

      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  info: async (req, res) => {
    try {
      const saleTemp = await prisma.saleTemp.findFirst({
        where: {
          id: parseInt(req.params.id),
        },
        include: {
          Food: {
            include: {
              FoodCategories: {
                include: {
                  Tastes: {
                    where: {
                      status: "use",
                    },
                  },
                  FoodSizes: {
                    where: {
                      status: "use",
                    },
                    orderBy: {
                      moneyAdded: "asc",
                    },
                  },
                },
              },
            },
          },
          SaleTempDetails: {
            include: {
              Food: true,
              FoodSize: true,
            },
            orderBy: {
              id: "asc",
            },
          },
        },
      });
      return res.send({ results: saleTemp });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  selectTaste: async (req, res) => {
    try {
      await prisma.saleTempDetail.update({
        where: {
          id: req.body.saleTempDetailId,
        },
        data: {
          tasteId: req.body.tasteId,
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  unSelectTaste: async (req, res) => {
    try {
      await prisma.saleTempDetail.update({
        where: {
          id: req.body.saleTempDetailId,
        },
        data: {
          tasteId: null,
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  selectSize: async (req, res) => {
    try {
      await prisma.saleTempDetail.update({
        where: {
          id: req.body.saleTempDetailId,
        },
        data: {
          foodSizeId: req.body.sizeId,
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  unSelectSize: async (req, res) => {
    try {
      await prisma.saleTempDetail.update({
        where: {
          id: req.body.saleTempDetailId,
        },
        data: {
          foodSizeId: null,
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  createSaleTempDetail: async (req, res) => {
    try {
      const saleTempId = req.body.saleTempId;
      const saleTempDetail = await prisma.saleTempDetail.findFirst({
        where: {
          saleTempId: saleTempId,
        },
      });

      await prisma.saleTempDetail.create({
        data: {
          saleTempId: saleTempDetail.saleTempId,
          foodId: saleTempDetail.foodId,
        },
      });

      const countSaleTempDetail = await prisma.saleTempDetail.count({
        where: {
          saleTempId: saleTempDetail.saleTempId,
        },
      });

      await prisma.saleTemp.update({
        where: {
          id: saleTempDetail.saleTempId,
        },
        data: {
          qty: countSaleTempDetail,
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  removeSaleTempDetail: async (req, res) => {
    try {
      const saleTempDetailId = req.body.saleTempDetailId;
      const saleTempDetail = await prisma.saleTempDetail.findFirst({
        where: {
          id: saleTempDetailId,
        },
      });

      if (!saleTempDetail) {
        return res.status(404).send({ error: "SaleTempDetail not found" });
      }
      // ใช้ transaction ลบข้อมูลและอัปเดต qty
      await prisma.$transaction(async (prisma) => {
        await prisma.saleTempDetail.delete({
          where: {
            id: saleTempDetailId,
          },
        });

        const countSaleTempDetail = await prisma.saleTempDetail.count({
          where: {
            saleTempId: saleTempDetail.saleTempId,
          },
        });

        await prisma.saleTemp.update({
          where: {
            id: saleTempDetail.saleTempId,
          },
          data: {
            qty: countSaleTempDetail,
          },
        });
      });

      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  printBillBeforePay: async (req, res) => {
    try {
      const organization = await prisma.organization.findFirst();

      const saleTemps = await prisma.saleTemp.findMany({
        include: {
          Food: true,
          SaleTempDetails: true,
        },
        where: {
          userId: req.body.userId,
          tableNumber: req.body.tableNumber,
        },
      });

      const parseAddress = JSON.parse(organization.address);

      const pdfkit = require("pdfkit");
      const fs = require("fs");
      const dayjs = require("dayjs");

      const paperWidth = 80;
      const padding = 3;
      const doc = new pdfkit({
        size: [paperWidth, 200],
        margins: {
          top: 3,
          bottom: 3,
          left: 3,
          right: 3,
        },
      });
      const fileName = `uploads/bill/bill-${dayjs(new Date()).format(
        "YYYYMMDDHHmmss"
      )}.pdf`;
      const font = "sarabun/Sarabun-Regular.ttf";

      doc.pipe(fs.createWriteStream(fileName));

      const logoWidth = 20;
      const positionX = paperWidth / 2 - logoWidth / 2;

      doc.image(`uploads/logo/${organization.logo}`, positionX, 5, {
        align: "center",
        width: logoWidth,
        height: 20,
      });
      doc.moveDown(1.5);

      doc.font(font);
      doc.fontSize(5).text("*** ใบแจ้งรายการ ***", 20, doc.y + 8);
      doc.fontSize(8);
      doc.text(organization.name, padding, doc.y);
      doc.fontSize(5);
      doc.text(
        `${parseAddress.address} ต.${parseAddress.subDistrict} อ.${parseAddress.district} จ.${parseAddress.province} ${parseAddress.zipCode}`
      );
      doc.text(`เบอร์โทร: ${organization.phone}`);
      doc.text(`เลขประจำตัวผู้เสียภาษี: ${organization.taxCode}`);
      doc.text(`โต๊ะ: ${req.body.tableNumber}`, { align: "center" });
      doc.text(`วันที่: ${dayjs(new Date()).format("DD/MM/YYYY HH:mm:ss")}`, {
        align: "center",
      });
      doc.text(`รายการอาหาร`, { align: "center" });
      doc.moveDown();

      const y = doc.y; // อัพเดตข้อมูลลงในบรรทัดเดียวกัน หรือสั่งให้ doc.y ไม่เพิ่มโดยอัตโนมัต (const)
      doc.fontSize(4);
      doc.text("รายการ", padding, y);
      doc.text("ราคา", padding + 18, y, { align: "right", width: 20 });
      doc.text("จำนวน", padding + 36, y, { align: "right", width: 20 });
      doc.text("รวม", padding + 55, y, { align: "right" });

      doc.lineWidth(0.1);
      doc
        .moveTo(padding, y + 6)
        .lineTo(paperWidth - padding, y + 6)
        .stroke();

      saleTemps.map((item, index) => {
        const y = doc.y;
        doc.text(item.Food.name, padding, y);
        doc.text(item.Food.price, padding + 18, y, {
          align: "right",
          width: 20,
        });
        doc.text(item.qty, padding + 36, y, { align: "right", width: 20 });
        doc.text(item.Food.price * item.qty, padding + 55, y, {
          align: "right",
        });
      });

      let sumAmount = 0;
      saleTemps.forEach((item) => {
        sumAmount += item.Food.price * item.qty;
      });

      doc.text(`รวม: ${sumAmount.toLocaleString("th-TH")} บาท`, {
        align: "right",
      });
      doc.end();

      return res.send({ message: "success", fileName: fileName });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  endSale: async (req, res) => {
    const { userId, amount, inputMoney, payType, tableNumber, changeMoney } =
      req.body;

    try {
      const saleTemps = await prisma.saleTemp.findMany({
        include: {
          SaleTempDetails: {
            include: {
              Food: true,
              FoodSize : true,
            },
          },
          Food: true,
        },
        where: { userId },
      });

      if (saleTemps.length === 0) {
        return res.status(400).send({ error: "ไม่พบข้อมูลการขายชั่วคราว" });
      }

      await prisma.$transaction(async (tx) => {
        //create bill
        const billSale = await tx.billSale.create({
          data: {
            amount,
            inputMoney,
            payType,
            tableNumber,
            userId,
            changeMoney,
          },
        });
        // create array billSaleDetails

        const billSaleDetailsData = [];

        for (const item of saleTemps) {
          if (item.SaleTempDetails.length > 0) {
            for (const detail of item.SaleTempDetails) {
              billSaleDetailsData.push({
                billSaleId: billSale.id,
                foodId: detail.foodId,
                tasteId: detail.tasteId,
                moneyAdded: detail.FoodSize?.moneyAdded,
                price: detail.Food.price,
                foodSizeId: detail.foodSizeId
              });
            }
          } else {
            const qty = Math.max(item.qty, 1);
            for (let i = 0; i < qty; i++) {
              billSaleDetailsData.push({
                billSaleId: billSale.id,
                foodId: item.foodId,
                price: item.Food.price,
              });
            }
          }
        }

        // create many
        await tx.billSaleDetail.createMany({
          data: billSaleDetailsData,
        });

        // delete all saleTempDetails
        await tx.saleTempDetail.deleteMany({
          where: {
            saleTempId: {
              in: saleTemps.map((item) => item.id),
            },
          },
        });

        // delete all saleTemps
        await tx.saleTemp.deleteMany({
          where: { userId },
        });
      });

      res.send({ message: "success" });
    } catch (error) {
      console.error("Error in endSale:", error);
      return res.status(500).send({ error: error.message });
    }
  },
  printBillAfterPay: async (req, res) => {
    try {
      // organization
      const organization = await prisma.organization.findFirst();
      const parseAddress = JSON.parse(organization.address);

      // billSale
      const billSale = await prisma.billSale.findFirst({
        where: {
          userId: req.body.userId,
          tableNumber: req.body.tableNumber,
          status: "use",
        },
        include: {
          BillSaleDetails: {
            include: {
              Food: true,
              FoodSize : true,
            },
          },
          User: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      // saleTemps
      const billSaleDetails = billSale.BillSaleDetails;

      // create bill by pdfkit
      const pdfkit = require("pdfkit");
      const fs = require("fs");
      const dayjs = require("dayjs");

      const paperWidth = 80;
      const padding = 3;

      const doc = new pdfkit({
        size: [paperWidth, 200],
        margins: {
          top: 3,
          bottom: 3,
          left: 3,
          right: 3,
        },
      });

      const fileName = `uploads/bill/bill-${dayjs(new Date()).format(
        "YYYYMMDDHHmmss"
      )}.pdf`;
      const font = `sarabun/Sarabun-Regular.ttf`;

      doc.pipe(fs.createWriteStream(fileName));

      // display logo
      const imageWidth = 20;
      const positionX = paperWidth / 2 - imageWidth / 2;
      doc.image(`uploads/logo/${organization.logo}`, positionX, 5, {
        align: "center",
        width: imageWidth,
        height: 20,
      });
      doc.moveDown(1.5);
      doc.font(font);
      doc.fontSize(5).text(`*** ใบเสร็จรับเงิน ***`, 20, doc.y + 8);
      doc.fontSize(8).text(organization.name, padding, doc.y);
      doc.fontSize(5);
      doc.text(
        `${parseAddress.address} ต.${parseAddress.subDistrict} อ.${parseAddress.district} จ.${parseAddress.province} ${parseAddress.zipCode}`
      );
      doc.text(`เบอร์โทร: ${organization.phone}`);
      doc.text(`เลขประจำตัวผู้เสียภาษี: ${organization.taxCode}`);
      doc.text(`โต๊ะ: ${req.body.tableNumber}`, { align: "center" });
      doc.text(`วันที่: ${dayjs(new Date()).format("DD/MM/YYYY HH:mm:ss")}`, {
        align: "center",
      });
      doc.moveDown(1.5);

      const y = doc.y;
      doc.fontSize(4);
      doc.text("รายการ", padding, y);
      doc.text("ราคา", padding + 18, y, { align: "right", width: 20 });
      doc.text("จำนวน", padding + 36, y, { align: "right", width: 20 });
      doc.text("รวม", padding + 55, y, { align: "right" });

      doc.lineWidth(0.1);
      doc
        .moveTo(padding, y + 6)
        .lineTo(paperWidth - padding, y + 6)
        .stroke();

      billSaleDetails.map((item, index) => {
        const y = doc.y;
        let name = item.Food.name;
        if (item.FoodSizeId != null) {
          name += ` (${item.FoodSize.name} + ${item.FoodSize.moneyAdded})`;
        }
        doc.text(name, padding, y);
        doc.text(item.Food.price, padding + 18, y, {
          align: "right",
          width: 20,
        });
        doc.text(1, padding + 36, y, { align: "right", width: 20 }); //ใช้จำนวนจาก qty ไม่ได้
        doc.text(item.price + item.moneyAdded, padding + 55, y, {
          align: "right",
        }); //ใช้จำนวนจาก qty ไม่ได้
      });

      let sumAmount = 0;
      billSaleDetails.forEach((item) => {
        sumAmount += item.price + item.moneyAdded; //ใช้จำนวนจาก qty ไม่ได้
      });

      doc.text(
        `รวม: ${sumAmount.toLocaleString("th-TH")} บาท`,
        padding,
        doc.y,
        {
          align: "right",
          width: paperWidth - padding * 2,
        }
      );

      doc.text(
        `รับเงิน ${billSale.inputMoney.toLocaleString("th-TH")} บาท`,
        padding,
        doc.y,
        {
          align: "right",
          width: paperWidth - padding * 2,
        }
      );

      doc.text(
        `เงินถอน ${billSale.changeMoney.toLocaleString("th-TH")} บาท`,
        padding,
        doc.y,
        {
          align: "right",
          width: paperWidth - padding * 2,
        }
      );

      doc.end();

      return res.send({ message: "success", fileName: fileName });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};

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
      const { userId, tableNumber } = req.body;

      if (userId === undefined || tableNumber === undefined) {
        return res
          .status(400)
          .send({ error: "User ID and Table Number are required." });
      }

      const organization = await prisma.organization.findFirst();

      if (!organization) {
        return res
          .status(404)
          .send({ error: "Organization details not found." });
      }

      const saleTemps = await prisma.saleTemp.findMany({
        include: {
          Food: true,
          SaleTempDetails: {
            include: {
              Taste: true,
              FoodSize: true,
            },
          },
        },
        where: {
          userId: Number(userId),
          tableNumber: Number(tableNumber),
        },
      });

      if (!saleTemps || saleTemps.length === 0) {
        return res.status(404).send({ error: "No items found for this bill." });
      }

      const parseAddress = JSON.parse(organization.address);

      const pdfkit = require("pdfkit");
      const fs = require("fs");
      const dayjs = require("dayjs");

      const paperWidth = 80;
      const dynamicHeightEstimate =
        100 +
        saleTemps.length * 15 +
        saleTemps.reduce(
          (acc, st) => acc + (st.SaleTempDetails?.length || 0),
          0
        ) *
          5;
      const pageHeight = Math.max(200, dynamicHeightEstimate);

      const doc = new pdfkit({
        size: [paperWidth, pageHeight],
        margins: {
          top: 3,
          bottom: 3,
          left: 3,
          right: 3,
        },
        autoFirstPage: false,
      });

      doc.addPage({
        size: [paperWidth, pageHeight],
        margins: {
          top: 3,
          bottom: 3,
          left: 3,
          right: 3,
        },
      });

      const billId = dayjs(new Date()).format("YYYYMMDDHHmmss");
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
      doc.fontSize(5).text("*** ใบแจ้งรายการ ***", 18, doc.y + 8);
      doc.fontSize(5).text("(ก่อนชำระเงิน)", 25);
      doc.fontSize(8);
      doc.text(organization.name, 3, doc.y, { align: "center" });
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
      doc.moveDown(0.5);

      // --- Items Table Header ---

      const itemColX = 3;
      const itemColWidth = 30;
      const unitPriceColX = itemColX + itemColWidth + 2;
      const unitPriceColWidth = 13;
      const qtyColX = unitPriceColX + unitPriceColWidth + 2;
      const qtyColWidth = 10;
      const lineTotalColX = qtyColX + qtyColWidth + 2;
      const lineTotalColWidth = paperWidth - lineTotalColX - 3;

      const yTableHeader = doc.y;
      doc.text("รายการ", itemColX, yTableHeader, { width: itemColWidth });
      doc.text("ราคา", unitPriceColX, yTableHeader, {
        align: "right",
        width: unitPriceColWidth,
      });
      doc.text("Qty.", qtyColX, yTableHeader, {
        align: "center",
        width: qtyColWidth,
      });
      doc.text("รวม", lineTotalColX, yTableHeader, {
        align: "right",
        width: lineTotalColWidth,
      });

      const yLineAfterHeader = doc.y + 6;
      doc.lineWidth(0.1);
      doc
        .moveTo(itemColX, yLineAfterHeader)
        .lineTo(paperWidth - 3, yLineAfterHeader)
        .stroke();
      doc.moveDown(1.0);

      // --- Items List ---
      let grandTotal = 0;

      saleTemps.forEach((item) => {
        const mainFoodName = item.Food.name;
        const mainFoodBasePrice = item.Food.price;
        const quantity = item.qty;

        let optionsTextLines = [];
        let addedValueFromOptionsPerUnit = 0;

        if (item.SaleTempDetails && item.SaleTempDetails.length > 0) {
          item.SaleTempDetails.forEach((detail) => {
            let optionLineText = "";
            if (detail.Taste && detail.Taste.name) {
              optionLineText += detail.Taste.name;
            }
            if (detail.FoodSize && detail.FoodSize.name) {
              optionLineText +=
                (optionLineText ? ", " : "") + detail.FoodSize.name;
              if (
                typeof detail.FoodSize.moneyAdded === "number" &&
                detail.FoodSize.moneyAdded > 0
              ) {
                optionLineText += `(+${detail.FoodSize.moneyAdded.toLocaleString(
                  "th-TH"
                )})`;
                addedValueFromOptionsPerUnit += detail.FoodSize.moneyAdded;
              }
            }
            if (optionLineText) {
              optionsTextLines.push(optionLineText);
            }
          });
        }

        const effectiveUnitPrice =
          mainFoodBasePrice + addedValueFromOptionsPerUnit;
        const lineItemTotalAmount = effectiveUnitPrice * quantity;
        grandTotal += lineItemTotalAmount;

        // Print the main item line
        const yItemLine = doc.y;
        doc.fontSize(4);
        doc.text(mainFoodName, itemColX, yItemLine, {
          width: itemColWidth,
          lineBreak: true,
        });

        const mainFoodNameHeight = doc.heightOfString(mainFoodName, {
          width: itemColWidth,
          lineBreak: true,
        });

        let currentYForColumns = yItemLine;

        doc.text(
          effectiveUnitPrice.toLocaleString("th-TH"),
          unitPriceColX,
          currentYForColumns,
          {
            align: "right",
            width: unitPriceColWidth,
          }
        );
        doc.text(
          quantity.toLocaleString("th-TH"),
          qtyColX,
          currentYForColumns,
          { align: "right", width: qtyColWidth }
        );
        doc.text(
          lineItemTotalAmount.toLocaleString("th-TH"),
          lineTotalColX,
          currentYForColumns,
          {
            align: "right",
            width: lineTotalColWidth,
          }
        );
        doc.y = yItemLine + mainFoodNameHeight;
        doc.moveDown(0.2);

        if (optionsTextLines.length > 0) {
          doc.fontSize(3.5);
          optionsTextLines.forEach((option) => {
            if (doc.y + 3 > doc.page.height - doc.page.margins.bottom) {
              doc.addPage();
            }
            doc.text(` └ ${option}`, itemColX + 1, doc.y, {
              width: paperWidth - itemColX * 2 - 1,
              lineGap: 0.05,
            });
            doc.moveDown(0.05);
          });
        }
        doc.moveDown(0.4);
      });

      // --- Grand Total ---
      doc.moveDown(0.5);
      const yGrandTotalLine = doc.y;
      doc
        .lineWidth(0.1)
        .moveTo(itemColX, yGrandTotalLine)
        .lineTo(paperWidth - 3, yGrandTotalLine)
        .stroke();
      doc.moveDown(0.2);

      doc.fontSize(5);
      doc.text(`ยอดรวมสุทธิ:`, itemColX, doc.y, {
        width: lineTotalColX - itemColX - 2,
        align: "right",
      });
      doc.text(
        `${grandTotal.toLocaleString("th-TH")} บาท`,
        lineTotalColX,
        doc.y - doc.currentLineHeight(),
        { width: lineTotalColWidth, align: "right" }
      );
      doc.moveDown(1);

      // --- Footer ---
      doc.fontSize(4).text("ขอบคุณที่ใช้บริการ", 3, doc.y, { align: "center" });
      doc.moveDown(0.5);
      doc
        .fontSize(3.5)
        .text(`Bill ID: ${billId}`, 3, doc.y, { align: "center" });

      doc.end();

      return res.send({
        message: "success",
        fileName: fileName,
      });
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
              FoodSize: true,
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
                foodSizeId: detail.foodSizeId,
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
    // Fetch organization details once.
    const organization = await prisma.organization.findFirst();
    // Safely parse the address.
    const parsedAddress = organization?.address ? JSON.parse(organization.address) : {};

    // Fetch the specific bill sale with its details, food, food sizes, and tastes.
    const billSale = await prisma.billSale.findFirst({
      where: {
        userId: req.body.userId,
        tableNumber: req.body.tableNumber,
        status: "use", // Assuming 'use' implies the bill is ready for final print after payment
      },
      include: {
        BillSaleDetails: {
          include: {
            Food: true,
            FoodSize: true,
            Taste: true,
          },
        },
        User: true, // Including User if needed elsewhere, though not directly used in the print logic.
      },
      orderBy: {
        id: "desc", // Get the most recent bill for the user and table.
      },
    });

    // Handle case where no bill is found.
    if (!billSale) {
      return res.status(404).send({ message: "No active bill found for this table and user." });
    }

    const { BillSaleDetails: billSaleDetails, inputMoney, changeMoney } = billSale;

    // Initialize PDFKit and related modules.
    const pdfkit = require("pdfkit");
    const fs = require("fs");
    const dayjs = require("dayjs");

    // Define print layout constants.
    const paperWidth = 80; // In points (1/72 inch). For thermal printers, often 80mm.
    const padding = 3;
    const fontPath = `sarabun/Sarabun-Regular.ttf`; // Ensure this path is correct.

    // Define font sizes for consistent use.
    const fontSizeHeaderCompany = 8;
    const fontSizeHeaderDetails = 5;
    const fontSizeItemName = 4.5;
    const fontSizeItemOption = 3.5;
    const fontSizeFooter = 4;
    const fontSizeBillId = 3.5;

   
    const lineHeightMultiplier = 1.2;

    // --- Dynamic Height Calculation for Page Size ---
    let estimatedContentHeight = 0;

    
    estimatedContentHeight += 70;

    
    estimatedContentHeight += (fontSizeHeaderDetails * lineHeightMultiplier) + 1; 

    
    const dummyDocForCalculation = new pdfkit();
    
    dummyDocForCalculation.font(fontPath);

    
    const itemColWidth = 30; 

    billSaleDetails.forEach((item) => {
      // Calculate lines for main food name.
      const foodNameLines = Math.ceil(dummyDocForCalculation.widthOfString(item.Food.name, { size: fontSizeItemName }) / itemColWidth);
      estimatedContentHeight += (foodNameLines || 1) * fontSizeItemName * lineHeightMultiplier;

      // Add height for each potential option line.
      if (item.FoodSize && item.FoodSize.name) {
        estimatedContentHeight += fontSizeItemOption * lineHeightMultiplier;
      }
      if (item.Taste && item.Taste.name) {
        estimatedContentHeight += fontSizeItemOption * lineHeightMultiplier;
      }
    

      estimatedContentHeight += 2; // Small vertical spacing between individual items.
    });
    // End the dummy doc stream as it's no longer needed.
    dummyDocForCalculation.end();

   
    estimatedContentHeight += 10; 

    estimatedContentHeight += (fontSizeFooter * lineHeightMultiplier) + (fontSizeBillId * lineHeightMultiplier) + 5; // Text + spacing.

    
    const pageHeight = Math.max(200, estimatedContentHeight + 20); // Add a small buffer at the end.

    // Initialize the main PDF document with calculated height.
    const doc = new pdfkit({
      size: [paperWidth, pageHeight],
      margins: {
        top: 3,
        bottom: 3,
        left: 3,
        right: 3,
      },
      autoFirstPage: false, 
    });

    doc.addPage(); 

    // Define the output file name.
    const outputFileName = `uploads/bill/bill-${dayjs(new Date()).format("YYYYMMDDHHmmss")}.pdf`;

    
    doc.pipe(fs.createWriteStream(outputFileName));

    // --- Header Section ---
    const logoWidth = 20;
    const positionX = (paperWidth / 2) - (logoWidth / 2);
    doc.image(`uploads/logo/${organization.logo}`, positionX, 5, {
      align: "center",
      width: logoWidth,
      height: 20,
    });
    doc.moveDown(1.5);

    doc.font(fontPath);
    doc.fontSize(fontSizeHeaderDetails).text("*** ใบแจ้งรายการ ***", 18, doc.y + 8);
    doc.fontSize(fontSizeHeaderDetails).text("(ชำระเงินเสร็จสิ้น)", 22);
    doc.fontSize(fontSizeHeaderCompany);
    doc.text(organization.name, padding, doc.y, { align: "center" });
    doc.fontSize(fontSizeHeaderDetails);
    doc.text(
      `${parsedAddress.address || ''} ต.${parsedAddress.subDistrict || ''} อ.${parsedAddress.district || ''} จ.${parsedAddress.province || ''} ${parsedAddress.zipCode || ''}`
    );
    doc.text(`เบอร์โทร: ${organization.phone || 'N/A'}`);
    doc.text(`เลขประจำตัวผู้เสียภาษี: ${organization.taxCode || 'N/A'}`);
    doc.text(`โต๊ะ: ${req.body.tableNumber}`, { align: "center" });
    doc.text(`วันที่: ${dayjs(new Date()).format("DD/MM/YYYY HH:mm:ss")}`, {
      align: "center",
    });
    doc.text(`รายการอาหาร`, { align: "center" });
    doc.moveDown(0.5);

    // --- Items Table Header ---
    const itemColX = padding;
    // itemColWidth already defined for calculation: 30
    const unitPriceColX = itemColX + itemColWidth + 1;
    const unitPriceColWidth = 12;
    const qtyColX = unitPriceColX + unitPriceColWidth + 1;
    const qtyColWidth = 8;
    const lineTotalColX = qtyColX + qtyColWidth + 1;
    const lineTotalColWidth = paperWidth - lineTotalColX - padding;

    const yTableHeader = doc.y;
    doc.fontSize(4); // Use fixed font size for table header.
    doc.text("รายการ", itemColX, yTableHeader, { width: itemColWidth });
    doc.text("ราคา", unitPriceColX, yTableHeader, {
      width: unitPriceColWidth,
      align: "right",
    });
    doc.text("Qty.", qtyColX, yTableHeader, { // "Qty." is more concise.
      width: qtyColWidth,
      align: "right",
    });
    doc.text("รวม", lineTotalColX, yTableHeader, {
      width: lineTotalColWidth,
      align: "right",
    });

    const yLineAfterHeader = doc.y + 1;
    doc
      .lineWidth(0.1)
      .moveTo(itemColX, yLineAfterHeader)
      .lineTo(paperWidth - padding, yLineAfterHeader)
      .stroke();
    doc.moveDown(0.5);

    // --- Items List ---
    let grandTotal = 0;

    billSaleDetails.forEach((item) => {
      // Each BillSaleDetail represents a single item, so quantity is 1.
      const itemQuantity = 1;

      // Validate essential item data.
      if (!item.Food || typeof item.Food.name === 'undefined' || typeof item.price === 'undefined') {
          console.warn("Skipping bill item due to missing food name or price:", item);
          return; // Skip this item to prevent errors.
      }

      const mainFoodName = item.Food.name;
      // Use the price from BillSaleDetail, which should include the base price of the Food.
      const mainFoodBasePrice = item.price;

      let optionsTextLines = [];
      let addedValueFromOptionsPerUnit = 0;

      // Add FoodSize details.
      if (item.FoodSize && item.FoodSize.name) {
        let sizeText = item.FoodSize.name;
        if (typeof item.FoodSize.moneyAdded === "number" && item.FoodSize.moneyAdded > 0) {
          sizeText += ` (+${item.FoodSize.moneyAdded.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
          addedValueFromOptionsPerUnit += item.FoodSize.moneyAdded;
        }
        optionsTextLines.push(`ขนาด: ${sizeText}`);
      }
      // Add Taste details.
      if (item.Taste && item.Taste.name) {
        optionsTextLines.push(`รสชาติ: ${item.Taste.name}`);
      }
      // Add note if it exists in your schema.
      // if (item.note) {
      //   optionsTextLines.push(`หมายเหตุ: ${item.note}`);
      // }

      // Calculate effective unit price and line total.
      const effectiveUnitPrice = mainFoodBasePrice + addedValueFromOptionsPerUnit;
      const lineItemTotalAmount = effectiveUnitPrice * itemQuantity;
      grandTotal += lineItemTotalAmount;

      const yItemLineStart = doc.y; 
      doc.fontSize(fontSizeItemName);
      doc.text(mainFoodName, itemColX, yItemLineStart, {
        width: itemColWidth,
        lineBreak: true,
      });

      const mainFoodNameHeight = doc.heightOfString(mainFoodName, {
        width: itemColWidth,
        lineBreak: true,
      });

      
      doc.text(
        effectiveUnitPrice.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        unitPriceColX,
        yItemLineStart,
        { width: unitPriceColWidth, align: "right" }
      );
      doc.text(itemQuantity.toLocaleString("th-TH"), qtyColX, yItemLineStart, {
        width: qtyColWidth,
        align: "right",
      });
      doc.text(
        lineItemTotalAmount.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        lineTotalColX,
        yItemLineStart,
        { width: lineTotalColWidth, align: "right" }
      );

      
      let estimatedOptionsBlockHeight = optionsTextLines.length * fontSizeItemOption * lineHeightMultiplier;

      
      if (doc.y + mainFoodNameHeight + estimatedOptionsBlockHeight + 5 > doc.page.height - doc.page.margins.bottom) {
        doc.addPage(); 
        doc.y = doc.page.margins.top; 
      } else {
        doc.y = yItemLineStart + mainFoodNameHeight; 
      }
      doc.moveDown(0.1); 

      // Print options for the current item.
      if (optionsTextLines.length > 0) {
        doc.fontSize(fontSizeItemOption);
        optionsTextLines.forEach((optLine) => {
          
          if (doc.y + doc.currentLineHeight() > doc.page.height - doc.page.margins.bottom) {
            doc.addPage();
            doc.y = doc.page.margins.top;
          }
          doc.text(`  └ ${optLine}`, itemColX + 1, doc.y, { 
            width: paperWidth - itemColX * 2 - 1, // 
            lineGap: 0.05,
          });
          doc.moveDown(0.05); 
        });
      }
      doc.moveDown(0.4); 
    });

    // --- Grand Total & Payment Section ---
    doc.moveDown(0.5); 
    const yGrandTotalLine = doc.y;
    doc
      .lineWidth(0.1)
      .moveTo(itemColX, yGrandTotalLine)
      .lineTo(paperWidth - padding, yGrandTotalLine)
      .stroke();
    doc.moveDown(0.2);

    doc.fontSize(fontSizeHeaderDetails); // Use the general header details font size.
    doc.text(`ยอดรวมสุทธิ:`, itemColX, doc.y, {
      width: lineTotalColX - itemColX - 2,
      align: "right",
    });
    doc.text(
      `${grandTotal.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`,
      lineTotalColX,
      doc.y - doc.currentLineHeight(), // Align with "ยอดรวมสุทธิ:" text.
      {
        width: lineTotalColWidth,
        align: "right",
      }
    );

    // Safely format inputMoney and changeMoney, defaulting to 0 if undefined/null.
    const formattedInputMoney = (typeof inputMoney === "number" ? inputMoney : 0).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const formattedChangeMoney = (typeof changeMoney === "number" ? changeMoney : 0).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    doc.text(`รับเงิน: ${formattedInputMoney} บาท`, itemColX, doc.y, {
      align: "right",
      width: paperWidth - itemColX * 2, // Span across the whole printable width.
    });

    doc.text(`เงินถอน: ${formattedChangeMoney} บาท`, padding, doc.y, {
      align: "right",
      width: paperWidth - itemColX * 2, // Span across the whole printable width.
    });
    doc.moveDown(1); // Space before footer.

    // --- Footer Section ---
    doc.fontSize(fontSizeFooter).text("ขอบคุณที่ใช้บริการ", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(fontSizeBillId).text(`Bill ID: ${billSale.id}`, { align: "center" });

    // Finalize the PDF document.
    doc.end();

    return res.send({ message: "success", fileName: outputFileName });
  } catch (error) {
    console.error("Error generating bill after payment:", error);
    return res.status(500).send({ error: error.message });
  }
},
};

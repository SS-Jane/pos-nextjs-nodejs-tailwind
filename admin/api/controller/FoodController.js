const { PrismaClient } = require("@prisma/client");
const { remove } = require("./FoodCategoriesController");
const prisma = new PrismaClient();

module.exports = {
  list: async (req, res) => {
    try {
      const result = await prisma.food.findMany({
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
      return res.send({ result: result });
    } catch (error) {
      return res.status(500).send({ error: error.messages });
    }
  },
  upload: async (req, res) => {
    try {
      const myFiles = req.files.myFiles;
      if (myFiles != undefined) {
        const fileName = myFiles.name;
        const fileExtension = fileName.split(".").pop();
        const newFileName = `${Date.now()}.${fileExtension}`;
        const path = `uploads/${newFileName}`;

        myFiles.mv(path, async (error) => {
          if (error) {
            return res.status(500).send({ error: error.messages });
          }
          return res.send({ messages: "success", fileName: newFileName });
        });
      } else {
        return res.status(400).send({ error: "No file upload" });
      }
    } catch (error) {
      return res.status(500).send({ error: error.messages });
    }
  },
  create: async (req, res) => {
    try {
      await prisma.food.create({
        data: {
          FoodCategoryId: req.body.foodCategoryId,
          name: req.body.foodName,
          price: req.body.foodPrice,
          remark: req.bodyfoodRemark,
          img: req.body.foodImg,
        },
      });
      return res.send({ messages : "success" });
    } catch (error) {
      return res.status(500).send({ error: error.messages });
    }
  },
  remove: async (params) => {},
  update: async (params) => {},
};

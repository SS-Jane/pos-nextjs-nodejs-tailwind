const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

module.exports = {
  list: async (req, res) => {
    try {
      const results = await prisma.food.findMany({
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
      return res.send({ results: results });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  upload: async (req, res) => {
    try {
      const myFiles = req.files?.myFiles;

      if (myFiles != undefined) {
        const fileName = myFiles.name;
        const fileExtension = fileName.split(".").pop();
        const newFileName = `${Date.now()}.${fileExtension}`;
        const path = `uploads/${newFileName}`;

        myFiles.mv(path, async (error) => {
          if (error) {
            return res.status(500).send({ error: error.messages });
          }
          return res.send({ message: "success", fileName: newFileName });
        });
      } else {
        return res.status(400).send({ message: "No file upload" });
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      await prisma.food.create({
        data: {
          FoodCategoryId: req.body.foodCategoryId,
          name: req.body.foodName,
          price: req.body.foodPrice,
          remark: req.body.foodRemark,
          img: req.body.foodImg,
          foodCategory: req.body.foodCategory,
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  remove: async (req, res) => {
    try {
      await prisma.food.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          status: "delete",
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const oldFood = await prisma.food.findUnique({
        where: {
          id: parseInt(req.body.foodId),
        },
      });

      if (!oldFood) {
        return res.status(404).send({ message: "Food item not found" });
      }

      if (
        oldFood.img != "default-image.webp" &&
        fs.existsSync(`uploads/${oldFood.img}`)
      ) {
        fs.unlinkSync(`uploads/${oldFood.img}`);
      }

      await prisma.food.update({
        data: {
          name: req.body.foodName,
          img: req.body.foodImg,
          remark: req.body.foodRemark,
          price: req.body.foodPrice,
          foodCategory: req.body.foodCategory,
        },
        where: {
          id: parseInt(req.body.foodId),
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  filter: async (req, res) => {
    try {
      let condition = {
        status: "use",
      };
      if (req.params.foodCategory != "all") {
        condition.foodCategory = req.params.foodCategory;
      }
      const foods = await prisma.food.findMany({
        where: condition,
        orderBy: {
          name: "asc",
        },
      });
      return res.send({ results: foods });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};

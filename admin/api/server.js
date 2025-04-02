const express = require("express");
const UserController = require("./controller/UserController");
const FoodCategoriesController = require("./controller/FoodCategoriesController");
const FoodSizeController = require("./controller/foodSizeController");
const bodyParser = require("body-parser");
const cors = require("cors");
const FoodTastesController = require("./controller/FoodTastesController");
const FoodController = require("./controller/FoodController");
const SaleTempController = require("./controller/SaleTempController");
const app = express();
const fileUpload = require("express-fileupload");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());
app.use("/uploads", express.static("uploads"));
// ---User API---
app.post("/api/user/signIn", (req, res) => UserController.signIn(req, res));
app.post("/api/user/signUp", (req, res) => UserController.signUp(req, res));

// ---Food categories API---
app.post("/api/foodCategories/create", (req, res) =>
  FoodCategoriesController.create(req, res)
);
app.get("/api/foodCategories/list", (req, res) =>
  FoodCategoriesController.list(req, res)
);
app.delete("/api/foodCategories/remove/:id", (req, res) =>
  FoodCategoriesController.remove(req, res)
);
app.put("/api/foodCategories/update", (req, res) =>
  FoodCategoriesController.update(req, res)
);

// ---Food sizes API---
app.post("/api/foodSizes/create", (req, res) =>
  FoodSizeController.create(req, res)
);
app.get("/api/foodSizes/list", (req, res) => FoodSizeController.list(req, res));
app.delete("/api/foodSizes/remove/:id", (req, res) =>
  FoodSizeController.remove(req, res)
);
app.put("/api/foodSizes/update", (req, res) =>
  FoodSizeController.update(req, res)
);

// ---Food taste API---
app.get("/api/foodTastes/list", (req, res) =>
  FoodTastesController.list(req, res)
);
app.post("/api/foodTastes/create", (req, res) =>
  FoodTastesController.create(req, res)
);
app.delete("/api/foodTastes/remove/:id", (req, res) =>
  FoodTastesController.remove(req, res)
);
app.put("/api/foodTastes/update", (req, res) =>
  FoodTastesController.update(req, res)
);

// ---Foods API---
app.get("/api/foods/list", (req, res) => FoodController.list(req, res));
app.post("/api/foods/upload", (req, res) => FoodController.upload(req, res));
app.post("/api/foods/create", (req, res) => FoodController.create(req, res));
app.delete("/api/foods/remove/:id", (req, res) =>
  FoodController.remove(req, res)
);
app.put("/api/foods/update", (req, res) => FoodController.update(req, res));
app.get("/api/foods/filter/:foodCategory", (req, res) =>
  FoodController.filter(req, res)
);

// ---SaleTemp API---
app.post("/api/saleTemp/create", (req, res) =>
  SaleTempController.create(req, res)
);
app.get("/api/saleTemp/list", (req, res) => SaleTempController.list(req, res));
app.delete("/api/saleTemp/remove/:id", (req, res) =>
  SaleTempController.remove(req, res)
);
app.delete("/api/saleTemp/removeAll", (req, res) =>
  SaleTempController.removeAll(req, res)
);
app.put("/api/saleTemp/updateQty", (req, res) =>
  SaleTempController.updateQty(req, res)
);
app.post("/api/saleTemp/generateSaleTempDetail", (req, res) =>
  SaleTempController.generateSaleTempDetail(req, res)
);
app.get("/api/saleTemp/info/:id", (req, res) =>
  SaleTempController.info(req, res)
);
app.put("/api/saleTemp/selectTaste", (req, res) =>
  SaleTempController.selectTaste(req, res)
);
app.put("/api/saleTemp/unSelectTaste", (req, res) => {
  SaleTempController.unSelectTaste(req, res);
});
app.put("/api/saleTemp/selectSize", (req, res) => {
  SaleTempController.selectSize(req, res);
});
app.put("/api/saleTemp/unSelectSize", (req, res) => {
  SaleTempController.unSelectSize(req, res);
});

app.listen(3001, () => {
  console.log("Listen at localhost port 3001");
});

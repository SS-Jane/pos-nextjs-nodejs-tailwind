const express = require("express");
const UserController = require("./controller/UserController");
const FoodCategoriesController = require("./controller/FoodCategoriesController");
const FoodSizeController = require("./controller/foodSizeController");
const bodyParser = require("body-parser");
const cors = require("cors");
const FoodTastesController = require("./controller/FoodTastesController");
const FoodController = require("./controller/FoodController");
const app = express();
const fileUpload = require("express-fileupload");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

app.post("/api/user/signIn", (req, res) => UserController.signIn(req, res));
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

app.get("/api/foods/list", (req, res) => FoodController.list(req, res));
app.post("/api/foods/upload", (req, res) => FoodController.upload(req, res));
app.post("/api/foods/create", (req, res) => FoodController.create(req, res));

app.listen(3001, () => {
  console.log("Listen at localhost port 3001");
});

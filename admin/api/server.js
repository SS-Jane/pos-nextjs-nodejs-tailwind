const express = require("express");
const UserController = require("./controller/UserController");
const FoodCategoriesController = require("./controller/FoodCategoriesController");
const FoodSizeController = require("./controller/foodSizeController");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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

app.listen(3001, () => {
  console.log("Listen at localhost port 3001");
});

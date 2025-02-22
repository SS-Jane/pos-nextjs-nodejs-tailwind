const express = require("express");
const UserController = require("./controller/UserController");
const FoodCategoriesController = require("./controller/FoodCategoriesController");
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

app.listen(3001, () => {
  console.log("Listen at localhost port 3001");
});

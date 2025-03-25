if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const UserController = require("./controllers/UserController");
const errorHandler = require("./middlewares/errorHandler");
const authentication = require("./middlewares/authentication");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/register", UserController.register);
app.post("/login", UserController.login);

app.use(authentication);
app.put("/users/edit", UserController.edit);

app.use(errorHandler);

module.exports = app;

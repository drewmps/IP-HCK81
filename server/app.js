if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const UserController = require("./controllers/UserController");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/register", UserController.register);
app.post("/login", UserController.login);

app.use(errorHandler);

module.exports = app;

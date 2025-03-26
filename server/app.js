if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const Controller = require("./controllers/Controller");
const errorHandler = require("./middlewares/errorHandler");
const authentication = require("./middlewares/authentication");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

var cors = require("cors");
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/register", Controller.register);
app.post("/login", Controller.login);
app.post("/auth/google", Controller.googleLogin);

app.use(authentication);
app.get("/users/", Controller.getCurrentUser);
app.patch("/users/edit", Controller.edit);
app.delete("/users/delete", Controller.delete);
app.get("/news", Controller.getNews);
app.post("/news/summarize", Controller.summarizeNews);
app.get("/news/:id", Controller.getNewsById);
app.post("/news/synthesize", Controller.synthesize);

app.use(errorHandler);

module.exports = app;

const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

const { User, News } = require("../models");
const { Op } = require("sequelize");
class Controller {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const user = await User.create({
        name,
        email,
        password,
      });
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      let errorValidation = [];
      if (!email) {
        errorValidation.push({ message: "Email is required" });
      }
      if (!password) {
        errorValidation.push({ message: "Password is required" });
      }
      if (errorValidation.length > 0) {
        next({ name: "ValidationError", errors: errorValidation });
        return;
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        next({ name: "Unauthorized", message: "Invalid email or password" });
        return;
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        next({ name: "Unauthorized", message: "Invalid email or password" });
        return;
      }

      const access_token = signToken({ id: user.id });
      res.status(200).json({
        access_token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async edit(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const user = req.user;
      await user.update({ name, email, password });
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const user = req.user;
      await user.destroy();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async getNews(req, res, next) {
    try {
      const { q } = req.query;
      const paramQuerySQL = {
        where: {},
      };

      if (q) {
        paramQuerySQL.where.title = {
          [Op.iLike]: `%${q}%`,
        };
      }

      const { rows } = await News.findAndCountAll(paramQuerySQL);

      res.status(200).json({
        data: rows,
      });
    } catch (error) {
      console.log("~ Controller ~ getNews ~ error:", error);
      next(error);
    }
  }

  static async getNewsById(req, res, next) {
    try {
      let { id } = req.params;

      let news = await News.findByPk(id);
      if (!news) {
        next({ name: "NotFound", message: "Data not found" });
        return;
      }

      res.status(200).json(news);
    } catch (error) {
      console.log("~ Controller ~ getNewsById ~ error:", error);
      next(error);
    }
  }
}

module.exports = Controller;

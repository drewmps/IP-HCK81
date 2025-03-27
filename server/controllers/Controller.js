const { comparePassword } = require("../helpers/bcrypt");
const getGeminiResponse = require("../helpers/geminiHelper");
const { signToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

const { User, News } = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
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

  static async googleLogin(req, res, next) {
    const { googleToken } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const [user, created] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          name: payload.name,
          email: payload.email,
          provider: "google",
          password: "google_id",
        },
        hooks: false,
      });

      const token = signToken({ id: user.id });
      res.status(created ? 201 : 200).json({ access_token: token });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async edit(req, res, next) {
    try {
      const { name } = req.body;

      const user = req.user;
      await user.update({ name });
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

  static async getCurrentUser(req, res, next) {
    const { name, email } = req.user;
    res.status(200).json({ name, email });
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

  static async summarizeNews(req, res, next) {
    try {
      const { text } = req.body;
      const response = await getGeminiResponse(text);
      res.status(200).json(response);
    } catch (error) {
      console.log("🚀 ~ Controller ~ summarizeNews ~ error:", error);
      next(error);
    }
  }

  static async synthesize(req, res, next) {
    try {
      const { text } = req.body;
      const apiKey = process.env.API_KEY_SYNTHESIZE;
      const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;
      const payload = {
        audioConfig: {
          audioEncoding: "MP3",
          effectsProfileId: ["small-bluetooth-speaker-class-device"],
          pitch: 0,
          speakingRate: 1,
        },
        input: {
          text: text,
        },
        voice: {
          languageCode: "en-US",
          name: "en-US-Standard-A",
        },
      };
      const response = await axios.post(endpoint, payload);
      res.status(200).json(response.data);
    } catch (error) {
      console.log("🚀 ~ Controller ~ synthesize ~ error:", error);

      next(error);
    }
  }
}

module.exports = Controller;

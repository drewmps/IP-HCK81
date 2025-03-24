const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

const { User } = require("../models");
class UserController {
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
}
module.exports = UserController;

const { User } = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  store: async (req, res) => {
    const { name, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    try {
      const user = await User.create({ name, email, password: hash });
      return res.status(201).json({
        message: "Success create user",
        user
      })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({
        where: { email: email }
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      const checkPassword = await bcrypt.compareSync(password, user.password);

      if (!checkPassword) return res.status(404).json({ message: "Invalid login" });

      const token = jwt.sign({
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }, 'secret');

      return res.status(200).json({
        message: "Success login",
        user,
        token
      })

    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  index: async (req, res) => {
    try {
      const user = await User.findAll();
      return res.status(200).json({
        message: "Read all users",
        user
      })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  me: async (req, res) => {
    try {
      const user = req.user
      return res.status(200).json({
        message: "show profile",
        user: user.user
      })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  updateUser: async (req, res) => {
    const { name, email } = req.body;
    try {
      const user = await User.findOne({
        where: { id: req.user.user.id }
      })

      if (!user) return res.status(404).json({ message: "User not found" });

      user.name = name;
      user.email = email;
      await user.save();

      return res.status(200).json({
        message: "Update profile",
        user
      })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  deleteStore: async (req, res) => {
    try {
      const user = await User.findOne({
        where: { id: id }
      })
      if (!user) return res.status(404).json({ message: "User not found" });

      await user.destroy();

      return res.status(200).json({
        message: "Delete user",
        user
      })

    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

}
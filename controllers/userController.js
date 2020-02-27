const { User } = require("../models");

module.exports = {
  store: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const user = await User.create({ name, email, password});
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
      let user = await User.findOne({
        where: { email: email }
      });

      
      if (!user) return res.status(404).json({ message: "User not found" });

      const isPasswordTrue = user.checkPassword(password, user.password);
      
      if (!isPasswordTrue) return res.status(404).json({ message: "Invalid login" });          
      
      const token = await user.generateAuthToken(user);
      
      return res.status(200).json({
        message: "Success login",
        user,
        token
      })

    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  index: async (_, res) => {
    try {
      const user = await User.findAll();
      return res.status(200).json({
        message: "Read all users",
        user
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  me: async (req, res) => {
    try {
      const user = req.user;
      return res.status(200).json({
        message: "Show profile",
        user: user.user
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  updateUser: async (req, res) => {
    const { name, email } = req.body;
    const { idUser } = req.params;

    try {
      const user = await User.findOne({
        where: { id: idUser }
      })

      if (!user) return res.status(404).json({ message: "User not found" });

      user.name = name;
      user.email = email;
      await user.save();

      return res.status(200).json({
        message: "Success updated profile",
        user
      })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },
  
  /**
   * User yg sedang login hanya bisa merubah Profile dirinya 
   * sendiri, sehingga tidak bisa merubah profile user lain
   * Endpoint update profile for user itself
   * User harus memiliki token nya sendiri
   * dan token didapat setelah ia login
   */
  updateItSelf: async (req, res) => {
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
        message: "Success updated profile itself",
        user
      })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  deleteStore: async (req, res) => {    
    const { idUser } = req.params;    

    try {
      const user = await User.findOne({
        where: { id: idUser }
      });
      
      if (!user) return res.status(404).json({ message: "User not found" });

      await user.destroy();

      return res.status(200).json({
        message: "Success deleted user",
        user
      })

    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },
  
  /**
   * User hanya bisa menghapus akunnya sendiri
   * Endpoint delete profile user itself
   * User harus memiliki token nya
   * token didapat setelah login
   */
  deleteItSelf: async (req, res) => {
    try {
      const user = await User.findOne({
        where: { id: req.user.user.id }
      })
      if (!user) return res.status(404).json({ message: "User not found" });

      await user.destroy();

      return res.status(200).json({
        message: "Success deleted user itself",
        user
      })

    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

}
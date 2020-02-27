const { User } = require("../models");

module.exports = {
  createUser: async () => {
    const payload = {
      name: 'TestUser',
      email: 'testUser@mail.com',
      password: 'secret',
    }
    let user = await User.findOne({
      where: { email: payload.email }
    });
    if (!user) {
        user = await User.create(payload);
        await user.save();
    }
    const token = await user.generateAuthToken(user);    
    return { user, token };
  }
}
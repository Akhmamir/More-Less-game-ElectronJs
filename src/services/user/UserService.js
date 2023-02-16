const { User } = require("../../models/User");

class UserService {
  #userRepository;

  constructor(userRepository) {
    this.#userRepository = userRepository;
  }

  async create(name, balance) {
    const user = new User(null, name, balance, Math.floor(Date.now() / 1000));

    return await this.#userRepository.create(user);
  }

  async getById(id) {
    const user = await this.#userRepository.get(id)

    return user;
  }
}

module.exports = {
  UserService,
};

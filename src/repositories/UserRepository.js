const { User } = require("../models/User");
const { BaseRepository } = require("./BaseRepository");

class UserRepository extends BaseRepository {
  async create(user) {
    const sql = `
        INSERT INTO users (name, balance, createTimestamp)
        VALUES ($name, $balance, $createTimestamp);
      `;

    const result = await this.dbService.execute(
      sql,
      {
        name: user.getName(),
        balance: user.getBalance(),
        createTimestamp: user.getCreateTimestamp(),
      },
      "INSERT"
    );

    if (result) {
      const id = result[0];

      return id;
    }

    return null;
  }

  async editBalance(id, balance) {
    const sql = `
      UPDATE users
      SET balance = $balance
      WHERE
        id = $id
      `;

    const result = await this.dbService.execute(
      sql,
      {
        id: id,
        balance: balance,
      },
      "UPDATE"
    );

    if (result) {
      const status = result[0];

      return status;
    }

    return null;
  }

  async get(id) {
    const sql = `
        SELECT * FROM users WHERE id = $id;
      `;

    const result = await this.dbService.execute(
      sql,
      {
        id: id,
      },
      "SELECT"
    );

    if (result) {
      const user = new User(
        result[0].id,
        result[0].name,
        result[0].balance,
        result[0].createTimestamp,
      );

      return user;
    }

    return null;
  }
}

module.exports = {
  UserRepository,
};

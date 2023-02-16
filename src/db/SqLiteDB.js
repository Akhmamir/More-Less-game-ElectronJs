const { Sequelize } = require("sequelize");
const { SqLiteExecuteTypes } = require("./SqLiteExecuteTypes");
const { dirname } = require("path");

class SqLiteDB {
  async init() {
    const appDir = dirname(require.main.filename);

    this.connection = new Sequelize({
      dialect: "sqlite",
      storage: `${appDir}\\database.db`,
    });

    try {
      await this.connection.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  async execute(sql, binds, type) {
    return await this.connection.query(sql, {
      bind: binds,
      type: SqLiteExecuteTypes[type],
    });
  }
}

module.exports = {
  SqLiteDB,
};

const { User } = require("../models/User");
const { BaseRepository } = require("./BaseRepository");

class GameRepository extends BaseRepository {
  async createGame(createTimestamp) {
    const sql = `
        INSERT INTO more_less_games (createTimestamp)
        VALUES ($createTimestamp)
      `;

    const result = await this.dbService.execute(
      sql,
      {
        createTimestamp: createTimestamp,
      },
      "INSERT"
    );

    if (result) {
      const id = result[0];

      return id;
    }

    return null;
  }

  async createStage(id_game, stage_number, first_number, createTimestamp) {
    const sql = `
        INSERT INTO more_less_games_stages (id_game, stage_number, first_number, second_number, createTimestamp)
        VALUES ($id_game, $stage_number, $first_number, null, $createTimestamp)
      `;

    const result = await this.dbService.execute(
      sql,
      {
        id_game: id_game,
        stage_number: stage_number,
        first_number: first_number,
        createTimestamp: createTimestamp,
      },
      "INSERT"
    );

    if (result) {
      const id = result[0];

      return id;
    }

    return null;
  }

  async getStage(id_stage) {
    const sql = `
        SELECT * FROM more_less_games_stages WHERE id = $id_stage;
      `;

    const result = await this.dbService.execute(
      sql,
      {
        id_stage: id_stage,
      },
      "SELECT"
    );

    if (result) {
      return result[0];
    }

    return null;
  }

  async editStage(id_game, stage_number, second_number) {
    const sql = `
      UPDATE more_less_games_stages
      SET second_number = $second_number
      WHERE
        id_game = $id_game AND
        stage_number = $stage_number
      `;

    const result = await this.dbService.execute(
      sql,
      {
        id_game: id_game,
        stage_number: stage_number,
        second_number: second_number,
      },
      "UPDATE"
    );

    if (result) {
      const status = result[0];

      return status;
    }

    return null;
  }

  async createBet(id_stage, id_user, amount, isMore) {
    const sql = `
        INSERT INTO more_less_games_bets (id_stage, id_user, amount, isMore, status)
        VALUES ($id_stage, $id_user, $amount, $isMore, null)
      `;

    const result = await this.dbService.execute(
      sql,
      {
        id_stage: id_stage,
        id_user: id_user,
        amount: amount,
        isMore: isMore,
      },
      "INSERT"
    );

    if (result) {
      const id = result[0];

      return id;
    }

    return null;
  }

  async editBet(id, isWin) {
    const sql = `
      UPDATE more_less_games_bets
      SET status = $isWin
      WHERE
        id = $id
      `;

    const result = await this.dbService.execute(
      sql,
      {
        id: id,
        isWin: isWin,
      },
      "UPDATE"
    );

    if (result) {
      const status = result[0];

      return status;
    }

    return null;
  }

  async getBet(id_stage) {
    const sql = `
        SELECT * FROM more_less_games_bets WHERE id_stage = $id_stage;
      `;

    const result = await this.dbService.execute(
      sql,
      {
        id_stage: id_stage,
      },
      "SELECT"
    );

    if (result) {
      return result[0];
    }

    return null;
  }

  async getHistory(userId) {
    const sql = `
        SELECT * FROM more_less_games_bets WHERE id_user = $id_user;
      `;

    const result = await this.dbService.execute(
      sql,
      {
        id_user: userId,
      },
      "SELECT"
    );

    if (result) {
      return result;
    }

    return null;
  }
}

module.exports = {
  GameRepository,
};

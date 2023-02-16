const { ipcMain } = require("electron");

class GameService {
  #window;

  #userRepository;
  #gameRepository;
  #gameConfig;

  #gameId;
  #stageId;
  #currentStage;
  #firstNumber;
  #secondNumber;

  constructor(userRepository, gameRepository, gameConfig) {
    this.#userRepository = userRepository;
    this.#gameRepository = gameRepository;
    this.#gameConfig = gameConfig;
  }

  setWindow(window) {
    this.#window = window;
  }

  async start() {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const gameId = await this.#gameRepository.createGame(currentTimestamp);

    if (gameId) {
      this.#gameId = gameId;
      this.#currentStage = 1;

      while (this.#currentStage <= this.#gameConfig.stages) {
        await this.iterate();
      }

      await this.#window.webContents.send("game.gameEnded", {
        success: true,
      });
    }

    return gameId;
  }

  async iterate() {
    this.generateNumbers();
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const stageId = await this.#gameRepository.createStage(
      this.#gameId,
      this.#currentStage,
      this.#firstNumber,
      currentTimestamp
    );

    this.#stageId = stageId;

    /**
     * Отправляем клиенту информацию о текущей итерации
     */
    await this.#window.webContents.send("game.stageStarted", {
      gameId: this.#gameId,
      stageId,
      currentStage: this.#currentStage,
      firstNumber: this.#firstNumber,
    });

    /**
     * Ждём 15 секунд на ставки
     */
    await new Promise((resolve) => {
      setTimeout(resolve, 15000);
    });

    /**
     * Обновляем информацию о итерации в БД
     */
    await this.resolveStage();

    /**
     * Обновляем статус ставки игрока и его баланс
     */
    const processResult = await this.processUserBet();
    await this.#window.webContents.send("game.stageEnded", {
      hasBet: processResult !== null,
      winStatus: processResult !== null ? processResult : null,
      secondNumber: this.#secondNumber,
    });

    /**
     * Ждём 1 секунду на показ информации
     * о состоянии ставки
     */
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    this.#currentStage++;
  }

  async resolveStage() {
    await this.#gameRepository.editStage(
      this.#gameId,
      this.#currentStage,
      this.#secondNumber
    );
  }

  async processUserBet() {
    const userBet = await this.#gameRepository.getBet(this.#stageId);

    if (userBet) {
      const stageData = await this.#gameRepository.getStage(this.#stageId);
      const user = await this.#userRepository.get(userBet.id_user);
      let isWon = 0;
      let newBalance = 0;

      if (
        (userBet.isMore === 1 &&
          stageData.first_number < stageData.second_number) ||
        (userBet.isMore === 0 &&
          stageData.first_number > stageData.second_number)
      ) {
        isWon = 1;
        newBalance =
          user.getBalance() +
          Math.round(userBet.amount * this.#gameConfig.winMultiplier);
      } else {
        newBalance = user.getBalance() - userBet.amount;
      }

      await this.#gameRepository.editBet(userBet.id, isWon);
      await this.#userRepository.editBalance(userBet.id_user, newBalance);

      return isWon === 1 ? true : false;
    }

    /**
     * Если был пропуск
     */
    return null;
  }

  randomNumberFromRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  async makeBet(userId, stageId, amount, isMore) {
    const result = await this.#gameRepository.createBet(
      stageId,
      userId,
      amount,
      isMore
    );

    if (result) {
      return {
        success: true,
      };
    }

    return result;
  }

  /**
   * крайне плохое решение, если диапазон чисел будет огромный
   */
  async generateNumbers() {
    /**
     * берём диапазон из чисел, у которых есть ккак большее число, так и меньшее
     */
    this.#firstNumber = this.randomNumberFromRange(
      this.#gameConfig.minNumber + 1,
      this.#gameConfig.maxNumber - 1
    );
    const minRangeForSecondNumber = [];

    /**
     * Заполняем массив числами меньше первого
     */
    for (let i = this.#gameConfig.minNumber; i < this.#firstNumber; i++) {
      minRangeForSecondNumber.push(i);
    }

    /**
     * Заполняем массив числами больше первого
     */
    for (let i = this.#firstNumber + 1; i <= this.#gameConfig.maxNumber; i++) {
      minRangeForSecondNumber.push(i);
    }

    /**
     * Берём случайный элемент массива
     */
    this.#secondNumber =
      minRangeForSecondNumber[
        this.randomNumberFromRange(0, minRangeForSecondNumber.length - 1)
      ];
  }

  async getHistory(userId) {
    return await this.#gameRepository.getHistory(userId);
  }
}

module.exports = {
  GameService,
};

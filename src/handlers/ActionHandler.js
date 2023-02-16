const { ipcMain } = require('electron');

class ActionHandler {
  #window;
  #userService;
  #gameService;

  constructor(userService, gameService) {
    this.#userService = userService;
    this.#gameService = gameService;
  }

  init() {
    this.initUserActions();
    this.initGameActions();
  }

  setWindow(window) {
    this.#window = window;
  }

  initUserActions() {
    ipcMain.handle('user.create', async (event, username, balance) => {
      const newUserId = await this.#userService.create(username, balance);

      if (newUserId) {
        return {
          success: true,
          data: {
            id: newUserId
          }
        }
      }

      return null;
    });
    ipcMain.handle('user.get', async (event, id) => {
      const user = await this.#userService.getById(id);

      if (user) {
        return {
          success: true,
          data: {
            user: {
              id: user.getId(),
              name: user.getName(),
              balance: user.getBalance(),
            }
          }
        }
      }

      return null;
    });
  }

  initGameActions() {
    ipcMain.handle('game.start', async (event) => {
      this.#gameService.setWindow(this.#window);
      this.#gameService.start()
    });
    ipcMain.handle('game.makeBet', async (event, userId, stageId, amount, isMore) => {
      return await this.#gameService.makeBet(userId, stageId, amount, isMore);
    });
    ipcMain.handle('game.getHistory', async (event, userId) => {
      return await this.#gameService.getHistory(userId);
    });
  }
}

module.exports = {
    ActionHandler,
};

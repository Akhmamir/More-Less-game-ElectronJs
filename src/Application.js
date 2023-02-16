const { app, BrowserWindow, ipcMain } = require('electron');
const { SqLiteDB } = require('./db/SqLiteDB');
const { ActionHandler } = require('./handlers/ActionHandler');
const path = require('path');

/**
 * Объект приложения. Отвечает за обработку запросов, соединения, внутренние сервисы и т.д.
 */
class Application {
  #actionHandler;
  #dbService;
  #window;

  /**
   * @param {ActionHandler} actionHandler
   * @param {SqLiteDB} dbService
   */
  constructor(actionHandler, dbService) {
    this.#actionHandler = actionHandler;
    this.#dbService = dbService;
  }

  async startApp() {
    await app.whenReady();
    this.createWindow();

    this.#window.loadFile('src/views/index.html');

    app.on('window-all-closed', async () => {
      await this.onCloseApp();
      app.quit();
    });
  }

  createWindow() {
    this.#window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'views\\js\\preload.js'),
        nodeIntegration: true,
        contextIsolation: false
      },
    });
    this.#window.removeMenu()
    this.#window.maximize();
    this.#actionHandler.init();
    this.#actionHandler.setWindow(this.#window);
  }

  async onCloseApp() {
    /**
     * хак для очистки БД после закрытия программы
     */
    await this.#dbService.execute(
      'DELETE FROM users;'
    );
    await this.#dbService.execute(
      'DELETE FROM more_less_games;'
    );
    await this.#dbService.execute(
      'DELETE FROM more_less_games_bets;'
    );
    await this.#dbService.execute(
      'DELETE FROM more_less_games_stages;'
    );
  }
}

module.exports = {
  Application,
};

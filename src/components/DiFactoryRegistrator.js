/**
 * Класс регистрирует фабрики сервисов в конфигурации приложения для регистрации.
 */
const { container } = require('tsyringe');

class DiFactoryRegistrator {
  static registerFactories(factoryList) {
    factoryList.forEach((item) => {
      this.registerCachedFactory(item.token, item.factory);
    });
  }

  static registerCachedFactory(token, factory) {
    container.register(token, {
      useFactory: factory,
    });
  }
}

module.exports = {
  DiFactoryRegistrator
};
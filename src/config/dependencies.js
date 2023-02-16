const { SqLiteDBFactory } = require('../di-factory/databases/SqLiteDBFactory');
const { ActionHandlerFactory } = require('../di-factory/handlers/ActionHandlerFactory');
const { UserRepositoryFactory } = require('../di-factory/repositories/UserRepositoryFactory');
const { GameRepositoryFactory } = require('../di-factory/repositories/GameRepositoryFactory');
const { UserServiceFactory } = require('../di-factory/services/UserServiceFactory');
const { GameServiceFactory } = require('../di-factory/services/GameServiceFactory');

const diDependencies = [
  // Database
  {
    token: "Database",
    factory: SqLiteDBFactory,
  },

  // Handlers
  {
    token: "ActionHandler",
    factory: ActionHandlerFactory,
  },

  // Repos
  {
    token: "UserRepository",
    factory: UserRepositoryFactory,
  },
  {
    token: "GameRepository",
    factory: GameRepositoryFactory,
  },

  // Services
  {
    token: "UserService",
    factory: UserServiceFactory,
  },
  {
    token: "GameService",
    factory: GameServiceFactory,
  },
];

module.exports = {
  diDependencies
};
const { GameService } = require('../../services/game/GameService');
const { game } = require('../../config/game');
const { instanceCachingFactory } = require('tsyringe');

const GameServiceFactory = instanceCachingFactory((container) => {
  return new GameService(
    container.resolve('UserRepository'),
    container.resolve('GameRepository'),
    game,
  );
});

module.exports = {
  GameServiceFactory
};
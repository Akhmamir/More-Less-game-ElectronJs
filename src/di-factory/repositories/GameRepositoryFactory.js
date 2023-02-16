const { GameRepository } = require('../../repositories/GameRepository');
const { instanceCachingFactory } = require('tsyringe');

const GameRepositoryFactory = instanceCachingFactory((container) => {
  return new GameRepository(
    container.resolve('Database'),
  );
});

module.exports = {
  GameRepositoryFactory
};

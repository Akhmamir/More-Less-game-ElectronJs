const { UserRepository } = require('../../repositories/UserRepository');
const { instanceCachingFactory } = require('tsyringe');

const UserRepositoryFactory = instanceCachingFactory((container) => {
  return new UserRepository(
    container.resolve('Database'),
  );
});

module.exports = {
  UserRepositoryFactory
};

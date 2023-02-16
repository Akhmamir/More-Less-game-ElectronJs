const { UserService } = require('../../services/user/UserService');
const { instanceCachingFactory } = require('tsyringe');

const UserServiceFactory = instanceCachingFactory((container) => {
  return new UserService(
    container.resolve('UserRepository'),
  );
});

module.exports = {
  UserServiceFactory
};
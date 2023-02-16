const { ActionHandler } = require('../../handlers/ActionHandler');
const { instanceCachingFactory } = require('tsyringe');

const ActionHandlerFactory = instanceCachingFactory((container) => {
  return new ActionHandler(
    container.resolve('UserService'),
    container.resolve('GameService'),
  );
});

module.exports = {
  ActionHandlerFactory
};
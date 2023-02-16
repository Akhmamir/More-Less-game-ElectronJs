const { SqLiteDB } = require('../../db/SqLiteDB');
const { instanceCachingFactory } = require('tsyringe');

const SqLiteDBFactory = instanceCachingFactory((container) => {
  return new SqLiteDB();
});

module.exports = {
  SqLiteDBFactory
};
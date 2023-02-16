require('reflect-metadata');
const { Application } = require('./Application');
const { DiFactoryRegistrator } = require('./components/DiFactoryRegistrator');
const { diDependencies } = require('./config/dependencies');
const { container } = require('tsyringe');

DiFactoryRegistrator.registerFactories(diDependencies);

const databaseService = container.resolve('Database');

Promise.all([databaseService.init()])
  .then(() => {
    const app = new Application(
      container.resolve('ActionHandler'),
      databaseService,
    );

    app.startApp();
  })
  .catch((error) => {
    console.log(error);
  });

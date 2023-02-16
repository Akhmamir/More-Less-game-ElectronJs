class BaseRepository {
  dbService;

  constructor(dbService) {
    this.dbService = dbService;
  }
}

module.exports = {
  BaseRepository
};
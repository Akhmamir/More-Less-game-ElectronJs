const { ipcRenderer } = require('electron');

ipcRenderer.on('game.stageStarted', function (evt, message) {
  window.gameEventHandler.stageStarted(message);
});
ipcRenderer.on('game.stageEnded', function (evt, message) {
  window.gameEventHandler.onStageEnded(message);
});

ipcRenderer.on('game.gameEnded', function (evt, message) {
  window.gameEventHandler.onGameEnded(message);
});

async function createNewUser(username, balance) {
  return await ipcRenderer.invoke('user.create', username, balance).then((result) => result);
}

async function getUser(id) {
  return await ipcRenderer.invoke('user.get', id).then((result) => result);
}

async function startGame(id) {
  return await ipcRenderer.invoke('game.start', id).then((result) => result);
}

async function makeBet(userId, stageId, amount, isMore) {
  return await ipcRenderer.invoke('game.makeBet', userId, stageId, amount, isMore).then((result) => result);
}

async function getHistory(userId) {
  return await ipcRenderer.invoke('game.getHistory', userId).then((result) => result);
}

window.api = {
  createNewUser,
  getUser,
  startGame,
  makeBet,
  getHistory,
};
const USER_BLOCK = $(".user-block");
const NAME_BLOCK = $(".user-block__name");
const BALANCE_BLOCK = $(".user-block__balance");

const PAGE_USER = $(".page-user");
const PAGE_GAME = $(".page-game");
const PAGE_HISTORY = $(".page-history");
const GAME_CONTENT = $(".page-game__content");
const FORM_GAME = $(".page-game__form");
const BET_STATUS_BLOCK = $(".bet-status");
const AMOUNT_BLOCK = $("#formBet");
const TIMER = $("#timer");

const HISTORY_TABLE = $(".history-table");

class GameEventHandler {
  userId;
  gameId;
  stageId;

  updateUserData(user) {
    USER_BLOCK.find(".user-block__name");
    USER_BLOCK.css("display", "block");
    NAME_BLOCK.find(".value").first().text(user.name);
    BALANCE_BLOCK.find(".value").first().text(user.balance);

    this.userId = user.id;
  }

  stageStarted(message) {
    GAME_CONTENT.find(".panel__first-number .value")
      .first()
      .text(message.firstNumber);
    this.stageId = message.stageId;
    this.restartTimer();
  }

  async onStageEnded(message) {
    GAME_CONTENT.find(".panel__second-number .value")
      .first()
      .text(message.secondNumber);

    FORM_GAME.css("display", "none");

    if (message.hasBet) {
      BET_STATUS_BLOCK.css("display", "block");

      if (message.winStatus === true) {
        BET_STATUS_BLOCK.text("Победа!");
      } else if (message.winStatus === false) {
        BET_STATUS_BLOCK.text("Поражение!");
      }
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    const userData = await window.api.getUser(this.userId);
    this.updateUserData(userData.data.user);

    FORM_GAME.removeClass("disabled");
    BET_STATUS_BLOCK.css("display", "none");
    FORM_GAME.css("display", "block");
    GAME_CONTENT.find(".panel__second-number .value").first().text("?");
  }

  async start() {
    PAGE_USER.css("display", "none");
    PAGE_GAME.css("display", "block");
    PAGE_HISTORY.css("display", "none");
    this.gameId = await window.api.startGame();
  }

  async makeBet() {
    const betStatus = await window.api.makeBet(
      this.userId,
      this.stageId,
      AMOUNT_BLOCK.val(),
      $('input[name="more-less-choose"]:checked').val() === "more"
    );

    if (betStatus) {
      FORM_GAME.addClass("disabled");
    }
  }

  restartTimer() {
    let countDownDate = new Date();
    countDownDate.setSeconds(countDownDate.getSeconds() + 15);

    let countDownTime = countDownDate.getTime();

    let timerInterval = setInterval(function () {
      let now = new Date().getTime();
      let distance = countDownTime - now;
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      TIMER.html(seconds + "c.");

      if (distance < 0) {
        clearInterval(timerInterval);
        TIMER.html("");
      }
    }, 1000);
  }

  onGameEnded() {
    PAGE_GAME.remove();
    alert(
      "Поздравляю! Вы закончили игру. Вы можете посмотретьи сторию ставок на отдельной странице в меню"
    );
  }

  async loadHistoryPage() {
    HISTORY_TABLE.find("tbody").html('');

    const data = await window.api.getHistory(this.userId);

    data.forEach(function (item, index) {
      HISTORY_TABLE.find("tbody")
        .first()
        .append(
          $(
            "<tr>" +
              '<th scope="row">' + parseInt(index + 1) +'</th>' +
              "<td>" + item.amount + "</td>" +
              "<td>" + (item.isMore === 1 ? 'Больше' : 'Меньше') + "</td>" +
              "<td>" + (item.status === 1 ? 'Выигрыш' : 'Проигрыш') + "</td>" +
            "</tr>"
          )
        );
    });
  }
}

module.exports = {
  GameEventHandler,
};
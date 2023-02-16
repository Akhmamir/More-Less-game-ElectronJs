const { GameEventHandler } = require("./GameEventHandler.js");

const PAGE_USER = $(".page-user");
const PAGE_GAME = $(".page-game");
const PAGE_HISTORY = $(".page-history");
const MENU = $("#menu");
const MAKE_BET_BUTTON = $("#game-button-make-bet");

$("#menu a").on("click", async function () {
  if (!$(this).hasClass("active")) {
    $("#menu a.active").removeClass("active");
    $(this).addClass("active");

    switch ($(this).attr("page")) {
      case "game":
        PAGE_USER.css("display", "none");
        PAGE_GAME.css("display", "block");
        PAGE_HISTORY.css("display", "none");
        break;
      case "history":
        PAGE_USER.css("display", "none");
        PAGE_GAME.css("display", "none");
        PAGE_HISTORY.css("display", "block");

        await window.gameEventHandler.loadHistoryPage();
        break;
    }
  }
});

$('input[name="more-less-choose"]').on("change", function () {
  if ($(this).val() === "skip") {
    MAKE_BET_BUTTON.attr("disabled", true);
  } else {
    MAKE_BET_BUTTON.removeAttr("disabled");
  }
});

$("#startGame").on("click", async function () {
  window.gameEventHandler = new GameEventHandler();

  MENU.removeClass("disabled");
  const username = $("#formUsername").val();
  const balance = $("#formBalance").val();

  const result = await window.api.createNewUser(username, balance);

  if (result && result.success) {
    const userData = await window.api.getUser(result.data.id);
    window.gameEventHandler.updateUserData(userData.data.user);
    window.gameEventHandler.start();
  }
});

MAKE_BET_BUTTON.on("click", async function () {
  await window.gameEventHandler.makeBet();
});

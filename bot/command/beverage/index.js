const api = require('../../api');
const context = require('./context');

module.exports = ({ accountId, roomId }, { action, args }) => {
  let waitMinute = undefined;

  const [opt, ...extraOpts] = args;

  if (!isNaN(opt)) {
    waitMinute = opt;
    startReceiveMenu(roomId, waitMinute);
    return;
  }

  switch (opt) {
    case '':
    case undefined:
      startReceiveMenu(roomId, waitMinute);
      break;
    case '마감':
      closeReceiveMenu(roomId);
      break;
    case '도움':
      displayHelp(roomId);
      break;
    default:
      receiveMenu()
  }
}

const displayHelp = async (roomId) => {
  let text = "";
  text += "!음료 명령어 도움말 >\n";
  text += "  - !음료 [마감 대기 시간(분), 기본값 30]\n";
  text += "  - !음료 [시킬 메뉴]\n";
  text += "  - !음료 마감\n";
  text += "  - !음료 추가\n";
  text += "  - !음료 삭제\n";
  text += "  - !음료 도움";

  await api.sendMessage(roomId, text);
}

const startReceiveMenu = async (roomId, waitMinute = 30) => {
  await api.sendMessage(roomId, "개발 중입니다.")
}

const closeReceiveMenu = async (roomId) => {
  await api.sendMessage(roomId, "개발 중입니다.")
}

const receiveMenu = async (accountId, chosenMenu) => {
  await api.sendMessage(roomId, "개발 중입니다.")
}
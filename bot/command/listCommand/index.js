const actions = require('../actions');
const api = require('../../api');

module.exports = async ({ accountId, roomId }, { action, args }) => {
  let text = "";

  for (let action in actions) {
    text += `!${action}\n`;
  }

  text += '\n각 명령어의 세부 사용법은\n"![명령어] 도움" 을 입력하세요.';

  await api.sendMessage(roomId, text);
}
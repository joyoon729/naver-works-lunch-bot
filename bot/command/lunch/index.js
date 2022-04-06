const api = require('../../api');
const context = require('./context');
const userContext = require('../user/context');

const menuList = () => {
  menus = context.availableMenu;
  let message = "";
  for (let menu in menus) {
    message += "  ";
    for (let keyword of menus[menu]) {
      message += "!" + keyword + " ";
    }
    message += "\n";
  }
  return message;
}

const startReceiveMenu = async (roomId, waitMinute = 30) => {
  context.enabled = true;
  context.timer[roomId] = setTimeout(async () => { await closeReceiveMenu(roomId) }, waitMinute * 60000);
  context.selectedMenu = {};

  let text = "<m accountId=\"all\">\n";
  text += "메뉴를 고르세요\n\n";
  text += "채팅 창에\n\n";
  text += menuList();
  text += "\n입력하세요.\n";
  text += `\n!마감 입력하거나 ${waitMinute}분 뒤 자동으로 마감됩니다.`

  await api.sendMessage(roomId, text);
}

const closeReceiveMenu = async (roomId) => {
  let text = "마감되었습니다.\n\n"
  const total = countMenu();

  for (menu in total) {
    text += `${menu}: ${total[menu]}\n`;
  }

  await displayUnappliedUser(roomId);
  await api.sendMessage(roomId, text);

  context.enabled = false;
  clearTimeout(context.timer[roomId]);
}

const receiveMenu = (accountId, chosenMenu) => {
  const menus = context.availableMenu;

  for (let menu in menus) {
    if (menu === chosenMenu) {
      context.selectedMenu[accountId] = chosenMenu;
      return;
    }
  }
}

const countMenu = () => {
  const total = {}
  for (let user in context.selectedMenu) {
    const menu = context.selectedMenu[user];
    if (!total[menu]) total[menu] = 1;
    else total[menu] += 1;
  }
  return total;
}

const displayHelp = async (roomId) => {
  let text = "";
  text += "!점심 명령어 도움말 >\n";
  text += "  - !점심 [마감 대기 시간(분), 기본값 30]\n";
  text += "  - !마감\n";
  text += "  - !점심 메뉴\n";
  text += "  - !점심 도움"

  await api.sendMessage(roomId, text);
}

const displayMenu = async (roomId) => {
  await api.sendMessage(roomId, menuList());
}

const displayUnappliedUser = async (roomId) => {
  const users = getUnappliedUser();

  if (Object.keys(users).length === 0) return;

  let text = "신청하지 않은 유저:\n";
  for (let id in users) {
    text += `${users[id]} 님,  `;

  }
  await api.sendMessage(roomId, text);
}

const getUnappliedUser = () => {
  const users = { ...userContext.users };
  const selectedMenu = context.selectedMenu;

  for (let user in selectedMenu) {
    delete users[user];
  }
  console.log(users);
  return users;
}

module.exports = ({ accountId, roomId }, { action, args }) => {
  let waitMinute = undefined;
  if (!isNaN(args[0])) waitMinute = args[0];
  else if (args[0] === '도움') {
    displayHelp(roomId);
    return;
  } else if (args[0] === '메뉴') {
    displayMenu(roomId);
    return;
  }

  switch (action) {
    case '점심':
      if (context.enabled) break;
      startReceiveMenu(roomId, waitMinute);
      break;
    case '마감':
      if (!context.enabled) break;
      closeReceiveMenu(roomId);
      break;
    default:
      receiveMenu(accountId, action);
  }
}
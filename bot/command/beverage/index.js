const fs = require('fs').promises;
const api = require('../../api');
const context = require('./context');
const userContext = require('../user/context');
const commandContext = require('../context');
const beverageJson = 'beverage.json';
const { WrongCommandError, ExclusiveCommandError, BotError } = require('../../errors');

module.exports = async ({ accountId, roomId }, { action, args }) => {
  const [opt, ...extraOpts] = args;

  switch (action) {
    case '음료':
      switch (opt) {
        case '메뉴':
          await api.sendMessage(roomId, listMenu());
          break;
        case '추가':
          menu = extraOpts.join(' ');
          await addMenu(menu);
          break;
        case '삭제':
          menu = extraOpts.join(' ');
          await removeMenu(menu);
          break;
        case '도움':
          await displayHelp(roomId);
          break;
        default:
          let waitMinute = undefined;
          if (!isNaN(opt)) waitMinute = opt;
          else if (opt) throw new WrongCommandError(action, args)
          await startReceiveMenu(roomId, action, waitMinute);
      }
      break;
    case '마감':
      await closeReceiveMenu(roomId);
      break;
    default:
      receiveMenu(accountId, action)
  }
}

const displayHelp = async (roomId) => {
  let text = "";
  text += "!음료 명령어 도움말 >\n";
  text += "  - !음료 [마감 대기 시간(분), 기본값 30]\n";
  text += "  - ![선택할 메뉴 번호]\n";
  text += "  - !마감\n";
  text += "  - !음료 메뉴\n";
  text += "  - !음료 추가|등록 [메뉴 명]\n";
  text += "  - !음료 삭제 [메뉴 명]\n";
  text += "  - !음료 도움";

  await api.sendMessage(roomId, text);
}

const startReceiveMenu = async (roomId, action, waitMinute = 30) => {
  if (commandContext.enabledOn) throw new ExclusiveCommandError();

  commandContext.enabledOn = action;
  context.timer[roomId] = setTimeout(async () => { await closeReceiveMenu(roomId) }, waitMinute * 60000);
  context.selectedMenu = {};

  let text = "<m accountId=\"all\">\n";
  text += "음료를 고르세요.\n\n";
  text += "채팅 창에\n";
  text += "![선택할 음료 번호]\n";
  text += "입력하세요.\n\n";
  text += listMenu();
  text += `\n\n!마감 입력하거나 ${waitMinute}분 뒤 자동으로 마감됩니다.`

  await api.sendMessage(roomId, text)
}

const closeReceiveMenu = async (roomId) => {
  let text = "마감되었습니다.\n\n";
  const total = countMenu();

  for (let menu in total) {
    text += `${menu}: ${total[menu]}\n`;
  }

  await displayUnappliedUser(roomId);
  await api.sendMessage(roomId, text);

  commandContext.enabledOn = undefined;
  clearTimeout(context.timer[roomId]);
}

const receiveMenu = (accountId, chosenNumber) => {
  const availableMenu = context.availableMenu;
  const menuNumber = {}

  let idx = 1;
  for (let menu in availableMenu) {
    menuNumber[idx] = menu;
    idx++;
  }

  if (menuNumber[chosenNumber]) {
    context.selectedMenu[accountId] = menuNumber[chosenNumber];
  } else {
    throw new BotError(`잘못된 메뉴 번호 - ${chosenNumber}`);
  }
}

const addMenu = async (menu) => {
  if (commandContext.enabledOn) {
    throw new BotError(`!음료 실행 중엔 메뉴를 추가할 수 없습니다.`)
  } else if (!menu) {
    throw new BotError(`추가할 메뉴를 입력하세요.`)
  }

  const menus = await readJson(beverageJson);
  menus[menu] = true;

  context.availableMenu = { ...menus };
  await updateJson(beverageJson, menus);
}

const removeMenu = async (menu) => {
  if (commandContext.enabledOn) throw new BotError(`!음료 실행 중엔 메뉴를 삭제할 수 없습니다.`)

  const menus = await readJson(beverageJson);
  delete menus[menu];

  context.availableMenu = { ...menus };
  await updateJson(beverageJson, menus);
}

const listMenu = () => {
  menus = context.availableMenu;

  let text = '등록된 메뉴:';
  let idx = 1;
  for (let menu in menus) {
    text += `\n[${idx}] ${menu}`;
    idx++;
  }
  return text;
}

const countMenu = () => {
  const total = {}
  for (let user in context.selectedMenu) {
    const menu = context.selectedMenu[user];
    total[menu] = (total[menu] ?? 0) + 1
  }
  return total
}

const readJson = async (path) => {
  let json;
  try {
    json = JSON.parse(await fs.readFile(path, 'utf8'));
  } catch {
    await fs.writeFile(path, '{}', 'utf8');
  } finally {
    json = JSON.parse(await fs.readFile(path, 'utf8'));
  }
  return json;
}

const updateJson = async (path, json) => {
  await fs.writeFile(path, JSON.stringify(json, null, 2), 'utf8');
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
  return users;
}

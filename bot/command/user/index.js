const fs = require('fs').promises;
const api = require('../../api');
const context = require('./context');
const initContext = require('./initContext');
const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const userJson = 'user.json';

module.exports = async ({ accountId, roomId }, { action, args }) => {
  if (Object.keys(context.users).length === 0) await initContext();

  if (!isValidArgs(args)) {
    let message = '잘못된 사용법입니다.\n';
    message += generateHelpMessage();
    await api.sendMessage(roomId, message);
    return;
  }

  const [option, userMail, userName] = args;

  switch (option) {
    case '등록':
      await editUser(userMail, userName);
      await api.sendMessage(roomId, `${userName} 님 등록되었습니다.`);
      break;
    case '변경':
      await editUser(userMail, userName);
      await api.sendMessage(roomId, `${userName} 님으로 변경되었습니다.`);
      break;
    case '삭제':
      await removeUser(userMail);
      await api.sendMessage(roomId, `${userMail} 계정이 봇에서 삭제됐습니다.`);
      break;
    case '목록':
      await listUser(roomId);
      break;
    case '도움':
      await api.sendMessage(roomId, generateHelpMessage());
      break;
  }
}

const isValidArgs = (args) => {
  let validity = true;

  const [option, userMail, userName] = args;
  console.log(option, userMail, userName)
  if (
    !option ||
    option !== '등록' && option !== '변경' && option !== '삭제' &&
    option !== '목록' && option !== '도움'
  ) validity = false;
  else if (option === '등록' || option === '변경') {
    if (!userMail || !userMail.toLowerCase().match(regex)) validity = false;
    if (!userName) validity = false;
  } else if (option === '삭제') {
    if (!userMail || !userMail.toLowerCase().match(regex)) validity = false;
  }
  return validity;
}

const editUser = async (userMail, userName) => {
  const users = await readUserJson();
  users[userMail] = userName;

  context.users = { ...users };
  await updateUserJson(users);
}

const removeUser = async (userMail) => {
  const users = await readUserJson();
  delete users[userMail];

  context.users = { ...users };
  await updateUserJson(users);
}

const listUser = async (roomId) => {
  console.log('listUser:', context);
  await api.sendMessage(roomId, JSON.stringify(context.users, null, 2));
}

const readUserJson = async () => {
  let users;
  try {
    users = JSON.parse(await fs.readFile(userJson, 'utf8'));
  } catch {
    await fs.writeFile(userJson, '{}', 'utf8');
  } finally {
    users = JSON.parse(await fs.readFile(userJson, 'utf8'));
  }
  return users;
}

const updateUserJson = async (json) => {
  await fs.writeFile(userJson, JSON.stringify(json, null, 2), 'utf8');
}

const generateHelpMessage = () => {
  let message = "";
  message += '!유저 [등록|변경] [메일] [이름]\n';
  message += '!유저 [삭제] [메일]\n';
  message += '!유저 목록\n';
  message += '!유저 도움';
  return message;
}
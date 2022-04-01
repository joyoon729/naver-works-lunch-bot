const api = require('./api');
const context = require('./context');

let isReceiving = false;
let selectedMenu = {};
const waitMinute = 30

const startReceiveMenu = async (roomId) => {
  isReceiving = true;
  selectedMenu = {};

  let text = "<m accountId=\"all\">\n";
  text += "메뉴를 고르세요\n\n";
  text += "채팅 창에\n\n";
  text += "  !도시락 !ㄷㅅㄹ\n"
  text += "  !유부 !ㅇㅂ\n"
  text += "  !치킨샐러드 !치킨 !ㅊㅋㅅㄹㄷ !ㅊㅋ\n";
  text += "  !오리샐러드 !오리 !ㅇㄹㅅㄹㄷ !ㅇㄹ\n";
  text += "  !샌드위치 !ㅅㄷㅇㅊ\n"
  text += "\n입력하세요.\n";
  text += `\n!마감 입력하거나 ${waitMinute}분 뒤 자동으로 마감됩니다.`

  setTimeout(async () => { await closeReceiveMenu(roomId) }, waitMinute * 60000);

  await api.sendMessage(roomId, text);
}

const closeReceiveMenu = async (roomId) => {
  if (!isReceiving) return;

  let text = "마감되었습니다.\n\n"
  const total = countMenu();

  for (menu in total) {
    text += `${menu}: ${total[menu]}\n`;
  }

  await api.sendMessage(roomId, text);

  isReceiving = false;
}

const receiveMenu = (accountId, text) => {
  switch (text) {
    case '!도시락':
    case '!ㄷㅅㄹ':
      selectedMenu[accountId] = '도시락';
      break;
    case '!유부':
    case '!ㅇㅂ':
      selectedMenu[accountId] = '유부 초밥';
      break;
    case '!치킨샐러드':
    case '!ㅊㅋㅅㄹㄷ':
    case '!치킨':
    case '!ㅊㅋ':
      selectedMenu[accountId] = '치킨 샐러드';
      break;
    case '!오리샐러드':
    case '!ㅇㄹㅅㄹㄷ':
    case '!ㅇㄽㄹㄷ':
    case '!오리':
    case '!ㅇㄹ':
      selectedMenu[accountId] = '오리 샐러드';
      break;
    case '!샌드위치':
    case '!ㅅㄷㅇㅊ':
      selectedMenu[accountId] = '샌드위치';
      break;
    case '!점심':
    case '!마감':
      break;
    default:
      if (text[0] === '!') api.sendMessage(context.roomId, '오타인 것 같은데...').then().catch();
      break;
  }
}

const countMenu = () => {
  const total = {}
  for (let user in selectedMenu) {
    const menu = selectedMenu[user];
    if (!total[menu]) total[menu] = 1;
    else total[menu] += 1;
  }
  return total;
}

module.exports = async (req, res) => {
  try {
    const type = req.body.type;
    const accountId = req.body.source.accountId;
    const roomId = req.body.source.roomId;
    context.roomId = roomId;  // update roomId to context

    switch (type) {
      // 사용자가 메시지(채팅) 보낼 때
      case 'message':
        const text = req.body.content.text;
        if (!isReceiving) {
          if (text === '!점심') await startReceiveMenu(roomId);
        } else {
          if (text === '!마감') await closeReceiveMenu(roomId);
          receiveMenu(accountId, text);
        }
        break;

      // 사용자가 대화방에 초대 됐을 때
      case 'joined':
        const memberList = req.body.memberList;
        await api.sendMessage(roomId, `${memberList[0].split('@')[0]}님 환영합니다.`);
        break;

      // 사용자가 대화방을 나갔을 때
      case 'left':
        break;

      // 봇이 대화방에 참여 했을 때
      case 'join':
        await api.sendMessage(roomId, '안녕하세요, 뭐 먹지 봇입니다.');
        break;

      // 봇이 대화방을 나갈 때
      case 'leave':
        break;
    }

    console.log(`\n[${new Date().toLocaleString('ko', { timeZone: 'Asia/Seoul' })}]\nMessage received:`);
    console.log(req.body);

    res.end();
  } catch (err) {
    res.end();
  }
}
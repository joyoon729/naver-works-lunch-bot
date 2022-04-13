const api = require('./api');
const context = require('./context');
const execCommand = require('./command');
const { BotError } = require('./errors');

const parse = (msg) => {
  if (msg[0] !== '!') return;
  const [action, ...args] = msg.slice(1).split(' ');
  return { action, args };
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
        const command = parse(text);
        if (command) await execCommand(req.body.source, command);
        break;

      // 사용자가 대화방에 초대 됐을 때
      case 'joined':
        await api.sendMessage(roomId, `${req.body.memberList[0]}님 환영합니다.\n뭐 먹지 봇에 유저 등록을 해주세요.\n!유저 등록 [이메일] [이름]`);
        break;

      // 사용자가 대화방을 나갔을 때
      case 'left':
        await api.sendMessage(roomId, `${req.body.memberList[0]}님이 나갔습니다.\n뭐 먹지 봇에 등록된 유저를 삭제해 주세요.\n!유저 삭제 [이메일]`);
        break;

      // 봇이 대화방에 참여 했을 때
      case 'join':
        await api.sendMessage(roomId, '안녕하세요, 뭐 먹지 봇입니다.');
        break;

      // 봇이 대화방을 나갈 때
      case 'leave':
        break;
    }

    // console.log(`\n[${new Date().toLocaleString('ko', { timeZone: 'Asia/Seoul' })}]\nMessage received:`);
    // console.log(req.body);

    res.end();
  } catch (err) {
    console.log(err);
    if (err instanceof BotError) {
      await api.sendMessage(context.roomId, err.message);
    }
    res.end();
  }
}
const axios = require('axios');

const { API_ID, botNo, domainId, headers } = require('./context');

const request = (method, url, data) => {
  return new Promise((resolve, reject) => {
    axios({ method, url, headers, data })
      .then(res => {
        console.log(res.data);
        resolve(res.data);
      })
      .catch(err => {
        console.log(err.response.data);
        reject(err.response.data);
      })
  })
}

// 도메인 api

const editDomain = async () => {
  const url = `https://apis.worksmobile.com/r/${API_ID}/message/v1/bot/${botNo}/domain/${domainId}`;
  const data = {
    usePublic: true
  };
  return await request('put', url, data);
}

// 봇 api

const sendMessage = async (roomId, message) => {
  const url = `https://apis.worksmobile.com/r/${API_ID}/message/v1/bot/${botNo}/message/push`;
  const data = {
    roomId: String(roomId),
    content: {
      type: 'text',
      text: message
    }
  }
  return await request('post', url, data);
}

const sendData = async (roomId, content) => {
  const url = `https://apis.worksmobile.com/r/${API_ID}/message/v1/bot/${botNo}/message/push`;
  const data = {
    roomId: String(roomId), content
  }
  return await request('post', url, data);
}

const listMemberInRoom = async (roomId) => {
  const url = `https://apis.worksmobile.com/r/${API_ID}/message/v1/bot/${botNo}/room/${roomId}/accounts`;
  return await request('get', url, null);
}

const createRoom = async (accountIds) => {
  const url = `https://apis.worksmobile.com/r/${API_ID}/message/v1/bot/${botNo}/room`;
  const data = { accountIds };
  return await request('post', url, data);
}

const registerDomain = async () => {
  const url = `https://apis.worksmobile.com/r/${API_ID}/message/v1/bot/${botNo}/domain/${domainId}`;
  return await request('post', url, {});
}

const detailBot = async () => {
  const url = `https://apis.worksmobile.com/r/${API_ID}/message/v1/bot/${botNo}`;
  return await request('get', url, null);
}

const listBot = async () => {
  const url = `https://apis.worksmobile.com/r/${API_ID}/message/v1/bot`;
  return await request('get', url, null);
}

// 조직 api

const listAllMember = async () => {
  const url = `https://apis.worksmobile.com/r/${API_ID}/organization/v2/domains/${domainId}/users?page=1`;
  return await request('get', url, null);
}

module.exports = {
  sendMessage, sendData, listMemberInRoom, createRoom, registerDomain, detailBot, listBot, editDomain,
  listAllMember
}
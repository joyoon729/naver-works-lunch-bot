const express = require('express');
const router = express.Router();

const receive = require('./receive');
const schedule = require('./schedule');

const devRoomId = 138007859

router.post('/', receive);
router.get('/', async (req, res) => {
  const api = require('./api');
  // await api.editDomain();
  // await api.sendMessage(devRoomId, "테스트 메시지");
  res.end();
});
router.post('/schedule', schedule);

module.exports = router;
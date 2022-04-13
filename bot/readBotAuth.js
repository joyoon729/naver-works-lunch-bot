const fs = require('fs').promises;
const botAuthPath = '.botAuth.json';

module.exports = (async () => {
  console.log("Read bot auth data...")
  return JSON.parse(await fs.readFile(botAuthPath, 'utf8'))
})()
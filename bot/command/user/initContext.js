const fs = require('fs').promises;
const context = require('./context');
const userJson = 'user.json';

module.exports = async () => {
  context.users = { ...(await readUserJson()) };
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
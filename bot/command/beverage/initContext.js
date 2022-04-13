const fs = require('fs').promises;
const context = require('./context');
const beverageJson = 'beverage.json';

module.exports = async () => {
  context.availableMenu = { ...(await readBeverageJson()) };
}

const readBeverageJson = async () => {
  let beverages;
  try {
    beverages = JSON.parse(await fs.readFile(beverageJson, 'utf8'));
  } catch {
    await fs.writeFile(beverageJson, '{}', 'utf8');
  } finally {
    beverages = JSON.parse(await fs.readFile(beverageJson, 'utf8'));
  }
  return beverages;
}
const ACTION = require('./actions');
const lunchContext = require('./lunch/context');
const coffeeContext = require('./coffee/context');

const { WrongCommandError } = require('../errors');

module.exports = (source, { action, args }) => {
  try {
    // console.log(action, args)
    const commandFunc = require(`./${ACTION[action]}`)
    commandFunc(source, { action, args });
  } catch (err) {
    const botErrorMessage = `잘못된 명령어 - ${action}`;

    if (lunchContext.enabled) {
      const menus = lunchContext.availableMenu;
      for (let menu in menus) {
        if (menus[menu].includes(action)) {
          commandFunc = require('./lunch');
          commandFunc(source, { action: menu, args });
          return;
        }
      }
      throw new WrongCommandError(botErrorMessage);
    }

    if (!coffeeContext.enabled) {
      throw new WrongCommandError(botErrorMessage);
    }

    if (err.code === 'MODULE_NOT_FOUND') {
      // 봇 에러 메시지 호출
      console.log(botErrorMessage);
      throw new WrongCommandError(botErrorMessage);
    }
    console.log(err);
  }
}
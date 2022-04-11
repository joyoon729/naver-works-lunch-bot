const ACTION = require('./actions');
const commandContext = require('./context');
const lunchContext = require('./lunch/context');
const beverageContext = require('./beverage/context');

const { WrongCommandError } = require('../errors');

module.exports = (source, { action, args }) => {
  if (commandContext.enabledOn &&
    commandContext.enabledOn !== ACTION[action] &&
    action !== '마감'
  ) {
    const botErrorMessage = `!${commandContext.enabledOn} 실행 중입니다.\n!${action} 실행할 수 없습니다.`
    throw new WrongCommandError(botErrorMessage);
  }

  try {
    const commandFunc = require(`./${ACTION[action]}`)
    commandFunc(source, { action, args });
  } catch (err) {
    console.log(err)
    const botErrorMessage = `잘못된 명령어 - ${action}`;

    if (commandContext.enabledOn) {
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

    if (!beverageContext.enabled) {
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
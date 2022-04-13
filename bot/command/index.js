const ACTION = require('./actions');
const commandContext = require('./context');

const { WrongCommandError, ExclusiveCommandError, BotError } = require('../errors');

module.exports = async (source, { action, args }) => {
  try {
    checkCommandMutex(action);
    const commandFunc = require(`./${ACTION[action].name}`)
    await commandFunc(source, { action, args });
  } catch (err) {
    // console.log(err);
    if (err instanceof ExclusiveCommandError) {
      err.message = `!${commandContext.enabledOn} 실행 중입니다.\n!${action} 실행할 수 없습니다.`;
      throw err;
    } else if (err instanceof WrongCommandError || err instanceof BotError) {
      throw err;
    }

    if (commandContext.enabledOn) {
      console.log(commandContext.enabledOn, "실행 중")
      commandFunc = require(`./${ACTION[commandContext.enabledOn].name}`);
      await commandFunc(source, { action, args })
      return;
    }

    throw new WrongCommandError(action, args);
  }
}

const checkCommandMutex = (action) => {
  if (commandContext.enabledOn && ACTION[action]) {
    if (
      ACTION[action].exclusive &&
      commandContext.enabledOn !== action
    ) {
      throw new ExclusiveCommandError();
    }
  }
}
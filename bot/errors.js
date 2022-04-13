class BotError extends Error {
  constructor(message) {
    super(message);
  }
}

class WrongCommandError extends BotError {
  constructor(action, args) {
    const message = `잘못된 명령어 - !${action} ${args.join(' ')}`;
    super(message);
    this.name = "WrongCommandError";
    this.code = 'WRONG_COMMAND'
  }
}

class ExclusiveCommandError extends BotError {
  constructor(message) {
    super(message);
    this.name = "ExclusiveCommandError";
    this.code = 'EXCLUSIVE_COMMAND'
  }
}

module.exports = {
  BotError, WrongCommandError, ExclusiveCommandError
}
class WrongCommandError extends Error {
  constructor(message) {
    super(message);
    this.name = "WrongCommandError";
    this.code = 'WRONG_COMMAND'
  }
}

module.exports = {
  WrongCommandError
}
class UnauthorizedError extends Error { // не может найти данные согласно запросу
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;

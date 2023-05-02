class NotFoundError extends Error { // не может найти данные согласно запросу
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;

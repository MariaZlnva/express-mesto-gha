class ForbiddenError extends Error { // доступ запрещен
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;

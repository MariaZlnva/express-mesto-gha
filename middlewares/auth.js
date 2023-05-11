const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const UnauthorizedError = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  console.log('пришли проходить аутентификацию');
  const { jwt } = req.cookies;
  if (!jwt) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  let payload;
  try {
    // проверяем что токен тот самый
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = {
    _id: payload._id,
  }; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};

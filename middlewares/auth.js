const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const UnauthorizedError = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  console.log('пришли проходить аутентификацию');
  // достаём авторизационный заголовок
  // const { token } = req.cookies;
  // console.log(token);
  // // убеждаемся, что он есть или начинается с Bearer
  // if (!token) {
  //   return res.status(401).send({ message: 'Необходима авторизация' });
  // }
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET); // проверяем что токен верный
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};

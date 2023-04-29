// создаем роутер
const routerUsers = require('express').Router();

const {
  getUsers,
  getUser,
  // createUser,
  updateUser,
  updateAvatar,
  // login,
} = require('../controllers/userController');

// routerUsers.post('/signin', login);
// routerUsers.post('/signup', createUser);
routerUsers.get('/users', getUsers);
routerUsers.get('/users/:userId', getUser);
// routerUsers.post('/users', createUser);
routerUsers.patch('/users/me', updateUser);
routerUsers.patch('/users/me/avatar', updateAvatar);

module.exports = routerUsers;

// PATCH /users/me — обновляет профиль
// PATCH /users/me/avatar — обновляет аватар

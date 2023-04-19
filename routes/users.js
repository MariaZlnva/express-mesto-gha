// создаем роутер
const routerUsers = require('express').Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/userController');

routerUsers.get('/users', getUsers);
routerUsers.get('/users/:userId', getUser);
routerUsers.post('/users', createUser);
routerUsers.patch('/users/me', updateUser);
routerUsers.patch('/users/me/avatar', updateAvatar);

module.exports = routerUsers;

// PATCH /users/me — обновляет профиль
// PATCH /users/me/avatar — обновляет аватар

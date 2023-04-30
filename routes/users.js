// создаем роутер
const routerUsers = require('express').Router();

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/userController');

routerUsers.get('/users', getUsers);
routerUsers.get('/users/me', getCurrentUser);
routerUsers.get('/users/:userId', getUser);
routerUsers.patch('/users/me', updateUser);
routerUsers.patch('/users/me/avatar', updateAvatar);

module.exports = routerUsers;

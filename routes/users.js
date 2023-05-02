// создаем роутер
const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/userController');

routerUsers.get('/users', getUsers);
routerUsers.get('/users/me', getCurrentUser);
routerUsers.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required(),
  }),
}), getUser);
routerUsers.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
routerUsers.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateAvatar);

module.exports = routerUsers;

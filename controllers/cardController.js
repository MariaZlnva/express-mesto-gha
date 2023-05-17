const Card = require('../models/cardSchema');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const ForbiddenError = require('../errors/Forbidden');

const getCards = ((req, res, next) => {
  console.log('пришел запрос на getCards');
  Card.find({})
    .populate([
      { path: 'likes', model: 'user' },
      { path: 'owner', model: 'user' },
    ])
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => next(err));
});

const createCard = (req, res, next) => {
  console.log('пришел запрос на createCard');
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    // .populate('owner')
    .then((card) => card.populate('owner'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  console.log('пришел запрос на deleteCard');
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .populate([
      { path: 'owner', model: 'user' },
    ])
    .then((card) => {
      console.log(userId, String(card.owner._id));
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (userId !== String(card.owner._id)) {
        throw new ForbiddenError('Нет прав на удаление данной карточки');
      }
      card.deleteOne();
    })
    .then(() => {
      res.send({ message: 'Пост удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  console.log('Пришел запрос на likeCard');
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate([
      { path: 'likes', model: 'user' },
      { path: 'owner', model: 'user' },
    ])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.send(card);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const disLikeCard = (req, res, next) => {
  console.log('Пришел запрос на disLikeCard');
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate([
      { path: 'likes', model: 'user' },
      { path: 'owner', model: 'user' },
    ])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
};

// PUT /cards/:cardId/likes — поставить лайк карточке
// DELETE /cards/:cardId/likes — убрать лайк с карточки

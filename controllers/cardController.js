const Card = require('../models/cardSchema');

const {
  ERROR_CODE_BAD_REG,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_SERV_ERR,
} = require('../constants/errors');

const getCards = ((req, res) => {
  console.log('пришел запрос на getCards');
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(ERROR_CODE_SERV_ERR).send({ message: 'Что-то пошло не так' });
    });
});

const createCard = (req, res) => {
  console.log('пришел запрос на createCard');
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REG).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(ERROR_CODE_SERV_ERR).send({ message: 'Что-то пошло не так' });
    });
};

const deleteCard = (req, res) => {
  console.log('пришел запрос на deleteCard');
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      // res.send({ data: card });
      res.send({ message: 'Пост удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REG).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(ERROR_CODE_SERV_ERR).send({ message: 'Что-то пошло не так' });
    });
};

const likeCard = (req, res) => {
  console.log('Пришел запрос на likeCard');
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });// не существ. id
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REG).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(ERROR_CODE_SERV_ERR).send({ message: 'Что-то пошло не так' });
    });
};

const disLikeCard = (req, res) => {
  console.log('Пришел запрос на disLikeCard');
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REG).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(ERROR_CODE_SERV_ERR).send({ message: 'Что-то пошло не так' });
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

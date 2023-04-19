const Card = require('../models/cardSchema');

const getCards = ((req, res) => {
  console.log('пришел запрос на getCards');
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
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
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  console.log('пришел запрос на deleteCard');
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      // res.send({ data: card });
      res.send({ message: 'Пост удален' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
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
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(500).send({ message: err.message });
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
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(500).send({ message: err.message });
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

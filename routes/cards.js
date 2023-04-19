// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору
const routerCard = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
} = require('../controllers/cardController');

routerCard.get('/cards', getCards);
routerCard.post('/cards', createCard);
routerCard.delete('/cards/:cardId', deleteCard);
routerCard.put('/cards/:cardId/likes', likeCard);
routerCard.delete('/cards/:cardId/likes', disLikeCard);

module.exports = routerCard;

// PUT /cards/:cardId/likes — поставить лайк карточке
// DELETE /cards/:cardId/likes — убрать лайк с карточки

import express from 'express';
import { ObjectId } from 'mongodb';
import mongo from '../modules/db';

const router = express.Router();

// GET api/cards
// Get all cards in deck of current user
router.get('/', async (req, res) => {
  if (!mongo.isConnected) {
    res.status(500).send('Mongo error');
    return;
  }
  if (!req.user) {
    res.status(401).send('No user logged in');
    return;
  }

  const deck = await mongo
    .db('ruruflashcards')
    .collection('decks')
    .findOne({ _id: req.user.deck_ids[0] });

  const cards = await mongo
    .db('ruruflashcards')
    .collection('cards')
    .find({ _id: { $in: deck.card_ids } })
    .toArray();

  res.send(cards);
});

// POST api/cards
// Add card to deck of current user
// body: {front, back}
router.post('/', async (req, res) => {
  const { front, back } = req.body;

  if (typeof front !== 'string' || typeof back !== 'string') {
    res.status(400).send();
    return;
  }
  if (!mongo.isConnected) {
    res.status(500).send('Mongo error');
    return;
  }
  if (!req.user) {
    res.status(401).send('No user logged in');
    return;
  }

  const { insertedId: newCardId } = await mongo
    .db('ruruflashcards')
    .collection('cards')
    .insertOne({ front, back });

  await mongo
    .db('ruruflashcards')
    .collection('decks')
    .updateOne({ _id: req.user.deck_ids[0] }, { $push: { card_ids: new ObjectId(newCardId) } });

  res.status(201).send(newCardId);
});

// PUT api/cards/:id
// Edit card in deck of current user
// body: {front?, back?}
router.put('/:id', async (req, res) => {
  const { front, back } = req.body;
  const { id: cardId } = req.params;

  if (!mongo.isConnected) {
    res.status(500).send('Mongo error');
    return;
  }
  if (!req.user) {
    res.status(401).send('No user logged in');
    return;
  }

  const deck = await mongo
    .db('ruruflashcards')
    .collection('decks')
    .findOne({
      _id: req.user.deck_ids[0],
      card_ids: new ObjectId(cardId),
    });
  if (!deck) {
    res.status(400).send(`User does not own card of id: ${cardId}`);
    return;
  }

  const changes: any = {};
  if (typeof front === 'string') changes.front = front;
  if (typeof back === 'string') changes.back = back;

  await mongo
    .db('ruruflashcards')
    .collection('cards')
    .updateOne({ _id: new ObjectId(cardId) }, { $set: changes });

  res.status(204).send();
});

// DELETE api/cards/:id
// Delete card
router.delete('/:id', async (req, res) => {
  const { id: cardId } = req.params;

  if (!mongo.isConnected) {
    res.status(500).send('Mongo error');
    return;
  }
  if (!req.user) {
    res.status(401).send('No user logged in');
    return;
  }

  const deck = await mongo
    .db('ruruflashcards')
    .collection('decks')
    .findOne({
      _id: req.user.deck_ids[0],
      card_ids: new ObjectId(cardId),
    });
  if (!deck) {
    res.status(400).send(`User does not own card of id: ${cardId}`);
    return;
  }

  await mongo
    .db('ruruflashcards')
    .collection('cards')
    .deleteOne({ _id: new ObjectId(req.params.id) });

  res.status(204).send();
});

export default router;

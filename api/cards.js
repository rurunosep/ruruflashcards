const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb')

// GET api/cards
// Get all cards in deck of current user
router.get('/', async (req, res) => {
  const { mongo } = req.locals

  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  if (!req.user) return res.status(401).send('No user logged in')

  const deck = await mongo
    .db('ruruflashcards')
    .collection('decks')
    .findOne({ _id: req.user.deck_ids[0] })

  const cards = await mongo
    .db('ruruflashcards')
    .collection('cards')
    .find({ _id: { $in: deck.card_ids } })
    .toArray()

  res.send(cards)
})

// POST api/cards
// Add card to deck of current user
// body: {front, back}
router.post('/', async (req, res) => {
  const { mongo } = req.locals
  const { front, back } = req.body

  if (typeof front !== 'string' || typeof back !== 'string') return res.status(400).send()
  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  if (!req.user) return res.status(401).send('No user logged in')

  const { insertedId: newCardId } = await mongo
    .db('ruruflashcards')
    .collection('cards')
    .insertOne({ front, back, enabled: true })

  await mongo
    .db('ruruflashcards')
    .collection('decks')
    .updateOne({ _id: req.user.deck_ids[0] }, { $push: { card_ids: ObjectId(newCardId) } })

  res.status(201).send(newCardId)
})

// PUT api/cards/:id
// Edit card in deck of current user
// body: {front?, back?, enabled?}
router.put('/:id', async (req, res) => {
  const { mongo } = req.locals
  const { front, back, enabled } = req.body
  const { id: cardId } = req.params

  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  if (!req.user) return res.status(401).send('No user logged in')

  const deck = await mongo
    .db('ruruflashcards')
    .collection('decks')
    .findOne({
      _id: req.user.deck_ids[0],
      card_ids: ObjectId(cardId) // TODO this explodes if cardId is wrong format
    })
  if (!deck) return res.status(400).send(`User does not own card of id: ${cardId}`)

  let changes = {}
  if (typeof front === 'string') changes.front = front
  if (typeof back === 'string') changes.back = back
  if (typeof enabled === 'boolean') changes.enabled = enabled

  await mongo
    .db('ruruflashcards')
    .collection('cards')
    .updateOne({ _id: ObjectId(cardId) }, { $set: changes }) // TODO above

  res.status(204).send()
})

// DELETE api/cards/:id
// Delete card
router.delete('/:id', async (req, res) => {
  const { mongo } = req.locals
  const { id: cardId } = req.params

  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  if (!req.user) return res.status(401).send('No user logged in')

  const deck = await mongo
    .db('ruruflashcards')
    .collection('decks')
    .findOne({
      _id: req.user.deck_ids[0],
      card_ids: ObjectId(cardId) // TODO above
    })
  if (!deck) return res.status(400).send(`User does not own card of id: ${cardId}`)

  await mongo
    .db('ruruflashcards')
    .collection('cards')
    .deleteOne({ _id: ObjectId(req.params.id) }) // TODO above

  res.status(204).send()
})

module.exports = router

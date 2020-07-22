const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb')

// GET api/cards
// Get all cards
router.get('/', (req, res) => {
  const { mongo } = req.locals
  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  mongo
    .db('ruruflashcards')
    .collection('cards')
    .find({})
    .toArray()
    .then((cards) => res.send(cards))
})

// POST api/cards
// Add card
// body: {front, back}
router.post('/', (req, res) => {
  const { mongo } = req.locals
  const { front, back } = req.body
  if (typeof front !== 'string' || typeof back !== 'string') return res.status(400).send()
  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  mongo
    .db('ruruflashcards')
    .collection('cards')
    .insertOne({ front, back, enabled: true })
    .then((result) => res.status(201).send({ _id: result.insertedId }))
})

// PUT api/cards/:id
// Edit card
// body: {front?, back?, enabled?}
router.put('/:id', (req, res) => {
  const { mongo } = req.locals
  const changes = req.body
  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  mongo
    .db('ruruflashcards')
    .collection('cards')
    .updateOne({ _id: ObjectId(req.params.id) }, { $set: changes })
    .then((result) => {
      if (result.result.nModified === 0)
        return res.status(400).send(`No card of _id: ${req.params.id}`)
      res.status(204).send()
    })
})

// DELETE api/cards/:id
// Delete card
router.delete('/:id', (req, res) => {
  const { mongo } = req.locals
  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  mongo
    .db('ruruflashcards')
    .collection('cards')
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then((result) => {
      if (result.result.nModified === 0)
        return res.status(400).send(`No card of _id: ${req.params.id}`)
      res.status(204).send()
    })
})

// GET api/cards/:id
// Get single card
router.get('/:id', (req, res) => {
  const { mongo } = req.locals
  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  mongo
    .db('ruruflashcards')
    .collection('cards')
    .findOne({ _id: ObjectId(req.params.id) })
    .then((card) => {
      if (!card) return res.status(400).send(`No card of _id: ${req.params.id}`)
      res.send(card)
    })
})

module.exports = router

const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb')

// Get all cards
router.get('/', (req, res) => {
  const { mongo } = req.locals
  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  mongo
    .db('ruruflashcards')
    .collection('card')
    .find({})
    .toArray()
    .then((cards) => res.send(cards))
})

// Add card
router.post('/', (req, res) => {
  const { mongo } = req.locals
  const { front, back } = req.body
  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  mongo
    .db('ruruflashcards')
    .collection('card')
    .insertOne({ front, back, enabled: true })
    .then((result) => res.send(result.insertedId))
})

// Edit card
router.put('/:id', (req, res) => {
  const { mongo } = req.locals
  const changes = req.body
  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  mongo
    .db('ruruflashcards')
    .collection('card')
    .updateOne({ _id: ObjectId(req.params.id) }, { $set: changes })
    .then(() => res.send())
})

// Delete card
router.delete('/:id', (req, res) => {
  const { mongo } = req.locals
  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  mongo
    .db('ruruflashcards')
    .collection('card')
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then(() => res.send())
})

// Get single card
router.get('/:id', (req, res) => {
  const { mongo } = req.locals
  if (!mongo.isConnected) return res.status(500).send('Mongo error')
  mongo
    .db('ruruflashcards')
    .collection('card')
    .findOne({ _id: ObjectId(req.params.id) })
    .then((card) => res.send(card))
})

module.exports = router

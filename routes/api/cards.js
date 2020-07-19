const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb')

// Get all cards
router.get('/', (req, res) => {
  const { mongo } = req._params
  if (mongo.isConnected()) {
    mongo
      .db('ruruflashcards')
      .collection('card')
      .find({})
      .toArray()
      .then((cards) => res.send(cards))
  } else {
    res.status(500).send('Mongo error')
  }
})

// Add card
router.post('/', (req, res) => {
  const { mongo } = req._params
  const { front, back } = req.body
  if (mongo.isConnected()) {
    mongo
      .db('ruruflashcards')
      .collection('card')
      .insertOne({ front, back, enabled: true })
      .then((result) => res.send(result.insertedId))
  } else {
    res.status(500).send('Mongo error')
  }
})

// Edit card
router.put('/:id', (req, res) => {
  const { mongo } = req._params
  const changes = req.body

  if (mongo.isConnected()) {
    mongo
      .db('ruruflashcards')
      .collection('card')
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: changes })
      .then(() => res.send())
  } else {
    res.status(500).send('Mongo error')
  }
})

// Delete card
router.delete('/:id', (req, res) => {
  const { mongo } = req._params
  if (mongo.isConnected()) {
    mongo
      .db('ruruflashcards')
      .collection('card')
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then(() => res.send())
  } else {
    res.status(500).send('Mongo error')
  }
})

// Get single card
router.get('/:id', (req, res) => {
  const { mongo } = req._params
  if (mongo.isConnected()) {
    mongo
      .db('ruruflashcards')
      .collection('card')
      .findOne({ _id: ObjectId(req.params.id) })
      .then((card) => res.send(card))
  } else {
    res.status(500).send('Mongo error')
  }
})

module.exports = router

const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

// POST api/auth/login
// Authenticate user of current session
// body: {username, password}
router.post('/login', (req, res) => {
  const { passport } = req.locals
  passport.authenticate('local', (err, user, info) => {
    req.logIn(user, () => {
      if (!user) return res.status(401).send('Invalid username or password')
      res.send(`Successfully logged in ${user.username}`)
    })
  })(req, res)
})

// GET api/auth/user
// Get authenticated user of current session
router.get('/user', (req, res) => {
  res.send(req.user ? req.user.username : null)
})

// POST api/auth/register
// Register a new user
// body: {username, password}
router.post('/register', async (req, res) => {
  const { mongo } = req.locals
  const { username, password } = req.body

  if (!username || !password) return res.status(400).send()
  if (!mongo.isConnected) return res.status(500).send('Mongo error')

  if (await mongo.db('ruruflashcards').collection('users').findOne({ username }))
    return res.status(400).send('User already exists')

  const { insertedId: defaultDeckId } = await mongo
    .db('ruruflashcards')
    .collection('decks')
    .insertOne({
      name: 'Default',
      card_ids: []
    })

  const salt = await bcrypt.genSalt()
  const password_hash = await bcrypt.hash(password, salt)

  const user = { username, password_hash, deck_ids: [defaultDeckId] }
  await mongo.db('ruruflashcards').collection('users').insertOne(user)

  req.logIn(user, () => {
    res.send(`Successfully registered ${username}`)
  })
})

// GET api/auth/logout
// Logout user of current session
router.get('/logout', (req, res) => {
  const username = req.user.username
  req.logOut()
  res.send(`Successfully logged out ${username}`)
})

module.exports = router

const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

// Authenticate user of current session with username and password
router.post('/login', (req, res) => {
  const { passport } = req.locals
  passport.authenticate('local', (err, user, info) => {
    req.logIn(user, () => {
      if (!user) return res.status(401).send('Invalid username or password')
      res.send(`Successfully logged in ${user.username}`)
    })
  })(req, res)
})

// Get authenticated user of current session
router.get('/user', (req, res) => {
  res.send(req.user ? req.user.username : '')
})

// Register a new user
router.post('/register', async (req, res) => {
  const { mongo } = req.locals
  const { username, password } = req.body
  if (!mongo.isConnected) return res.status(500).send('Mongo error')

  if (await mongo.db('ruruflashcards').collection('user').findOne({ username }))
    return res.status(400).send('User already exists')

  const salt = await bcrypt.genSalt()
  const password_hash = await bcrypt.hash(password, salt)
  const user = { username, password_hash, deck_ids: [] }
  await mongo.db('ruruflashcards').collection('user').insertOne(user)

  req.logIn(user, () => {
    res.send(`Successfully registered ${username}`)
  })
})

// Logout user of current session
router.get('/logout', (req, res) => {
  const username = req.user.username
  req.logOut()
  res.send(`Successfully logged out ${username}`)
})

module.exports = router

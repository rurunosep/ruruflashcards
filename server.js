const express = require('express')
const path = require('path')
const fs = require('fs')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const { MongoClient } = require('mongodb')
const { TextToSpeechClient } = require('@google-cloud/text-to-speech')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

// Load environment variables from config.js
if (process.env.NODE_ENV !== 'production') {
  Object.entries(require('./config')).map(([k, v]) => {
    process.env[k] = v
  })
}

let mongo, ttsClient, voices, languageCodes

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'client', 'build')))
initMongoDB()
initTTS()
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ client: mongo }),
    resave: false,
    saveUninitialized: true
  })
)
initPassport()

app.use((req, res, next) => {
  req.locals = { ...req.locals, ttsClient, voices, languageCodes, mongo, passport }
  next()
})

// Routes
app.use('/api/tts', require('./api/tts'))
app.use('/api/cards', require('./api/cards'))
app.use('/api/auth', require('./api/auth'))

// Start server
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server started on port ${port}`))

// --------------------
function initMongoDB() {
  const uri = process.env.MONGODB_URI
  mongo = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  mongo
    .connect()
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.err('Failed to connect to MongoDB'))
}

function initTTS() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS)
    ttsClient = new TextToSpeechClient({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key
      },
      projectId: credentials.project_id
    })

    ttsClient.listVoices().then(([response]) => {
      voices = response.voices
      languageCodes = [
        ...new Set(voices.map((v) => v.languageCodes).reduce((flat, x) => [...flat, ...x]))
      ].sort()

      if (!ttsClient || !voices || !languageCodes) throw Error()
      console.log('Initialized TTS')
    })
  } catch (err) {
    console.log('Failed to initalize TTS')
  }
}

function initPassport() {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        if (!mongo.isConnected) throw 'Mongo error'

        const user = await mongo.db('ruruflashcards').collection('users').findOne({ username })
        if (!user) return done(null, false)

        const isMatch = await bcrypt.compare(password, user.password_hash)
        if (!isMatch) return done(null, false)

        return done(null, user)
      } catch (err) {
        done(err)
      }
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.username)
  })

  passport.deserializeUser((username, done) => {
    if (!mongo.isConnected) return done('Mongo error')
    mongo
      .db('ruruflashcards')
      .collection('users')
      .findOne({ username })
      .then((user) => {
        if (!user) return done(null, false)
        return done(null, user)
      })
      .catch((err) => done(err))
  })

  app.use(passport.initialize())
  app.use(passport.session())
}

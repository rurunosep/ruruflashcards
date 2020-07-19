const express = require('express')
const path = require('path')
const fs = require('fs')
const { MongoClient } = require('mongodb')
const { TextToSpeechClient } = require('@google-cloud/text-to-speech')

const app = express()
app.use(express.json())

// Connect to MongoDB
const uri =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI
    : require('./keys').MONGODB_URI
const mongo = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongo
  .connect()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.err('Failed to connect to MongoDB'))

// Initialize Text-to-Speech
let ttsClient, voices, languageCodes
try {
  const credentials =
    process.env.NODE_ENV === 'production'
      ? JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS)
      : require('./keys').GOOGLE_CLOUD_CREDENTIALS

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
      ...new Set(
        voices.map((v) => v.languageCodes).reduce((flat, x) => [...flat, ...x])
      )
    ].sort()

    if (!ttsClient || !voices || !languageCodes) throw Error()
    console.log('Initialized TTS')
  })
} catch (err) {
  console.log('Failed to initalize TTS')
}

// Serve static assets
app.use(express.static(path.join(__dirname, 'client', 'build')))
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
)

// Route to TTS api
app.use(
  '/api/tts',
  (req, res, next) => {
    req._params = { ttsClient, voices, languageCodes }
    next()
  },
  require('./routes/api/tts')
)

// Route to cards api
app.use(
  '/api/cards',
  (req, res, next) => {
    req._params = { mongo }
    next()
  },
  require('./routes/api/cards')
)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server started on port ${port}`))

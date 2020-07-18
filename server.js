const KEY_FILE_LOCATION = 'D:\\Dev\\Web\\RuruFlashcards\\auth.json'

const express = require('express')
const fs = require('fs')
const cors = require('cors')
const { TextToSpeechClient } = require('@google-cloud/text-to-speech')
const MP3 = require('@google-cloud/text-to-speech/build/protos/protos').google
  .cloud.texttospeech.v1.AudioEncoding.MP3

const app = express()
app.use(express.json())
app.use(cors())

// Initialize Text-to-Speech
let client, voices, languageCodes
try {
  client = new TextToSpeechClient({ keyFilename: KEY_FILE_LOCATION })
  client.listVoices().then(([response]) => {
    voices = response.voices
    languageCodes = [
      ...new Set(
        voices.map((v) => v.languageCodes).reduce((flat, x) => [...flat, ...x])
      )
    ].sort()
  })
} catch (err) {
  console.log(err)
}

// Get voices
app.get('/api/voices', (req, res) => {
  if (voices) {
    res.send(voices)
  } else {
    res.status(500).send({ msg: 'Text-to-Speech error' })
  }
})

// Get language codes
app.get('/api/languageCodes', (req, res) => {
  if (languageCodes) {
    res.send(languageCodes)
  } else {
    res.status(500).send({ msg: 'Text-to-Speech error' })
  }
})

// Synthesize speech
app.post('/api/synthesizeSpeech', (req, res) => {
  const request = {
    input: { text: req.body.text },
    voice: { languageCode: req.body.languageCode, name: req.body.voice },
    audioConfig: { audioEncoding: MP3 }
  }
  client
    .synthesizeSpeech(request)
    .then(([response]) =>
      res.set({ 'Content-Type': 'audio/mp3' }).send(response.audioContent)
    )
})

app.listen(5000, () => console.log('Server started on port 5000'))

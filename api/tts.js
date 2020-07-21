const express = require('express')
const router = express.Router()
const MP3 = require('@google-cloud/text-to-speech/build/protos/protos').google.cloud.texttospeech.v1
  .AudioEncoding.MP3

// Get voices
router.get('/voices', (req, res) => {
  if (req.locals.voices) {
    res.send(req.locals.voices)
  } else {
    res.status(500).send('Text-to-Speech error')
  }
})

// Get language codes
router.get('/langs', (req, res) => {
  if (req.locals.languageCodes) {
    res.send(req.locals.languageCodes)
  } else {
    res.status(500).send('Text-to-Speech error')
  }
})

// Synthesize speech
router.post('/synth', (req, res) => {
  const request = {
    input: { text: req.body.text },
    voice: { languageCode: req.body.languageCode, name: req.body.voice },
    audioConfig: { audioEncoding: MP3 }
  }
  req.locals.ttsClient
    .synthesizeSpeech(request)
    .then(([response]) => res.set({ 'Content-Type': 'audio/mp3' }).send(response.audioContent))
})

module.exports = router

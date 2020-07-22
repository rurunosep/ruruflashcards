const express = require('express')
const router = express.Router()
const MP3 = require('@google-cloud/text-to-speech/build/protos/protos').google.cloud.texttospeech.v1
  .AudioEncoding.MP3

// GET api/tts/voices
// Get Google TTS voices
router.get('/voices', (req, res) => {
  if (req.locals.voices) {
    res.send(req.locals.voices)
  } else {
    res.status(500).send('Text-to-Speech error')
  }
})

// GET api/tts/langs
// Get Google TTS language codes
router.get('/langs', (req, res) => {
  if (req.locals.languageCodes) {
    res.send(req.locals.languageCodes)
  } else {
    res.status(500).send('Text-to-Speech error')
  }
})

// POST api/tts/synth
// Synthesize speech
// body: {text, languageCode, voice}
router.post('/synth', (req, res) => {
  // TODO check for errors
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

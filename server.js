const express = require('express')
const path = require('path')
const fs = require('fs')
const { TextToSpeechClient } = require('@google-cloud/text-to-speech')
const MP3 = require('@google-cloud/text-to-speech/build/protos/protos').google
  .cloud.texttospeech.v1.AudioEncoding.MP3

const app = express()
app.use(express.json())

// Serve static assets
app.use(express.static(path.join(__dirname, 'client', 'build')))
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
)

// Initialize Text-to-Speech
let client, voices, languageCodes
try {
  const credentials = JSON.parse(
    process.env.NODE_ENV === 'production'
      ? process.env.GOOGLE_CLOUD_CREDENTIALS
      : fs.readFileSync('google-cloud-credentials.json', 'utf-8')
  )

  client = new TextToSpeechClient({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key
    },
    projectId: credentials.project_id
  })

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

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server started on port ${port}`))

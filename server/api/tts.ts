import express from 'express'
import { ttsClient, voices, languageCodes } from '../modules/tts.js'

const MP3 = require('@google-cloud/text-to-speech/build/protos/protos').google.cloud.texttospeech.v1
	.AudioEncoding.MP3

const router = express.Router()

// GET api/tts/voices
// Get Google TTS voices
router.get('/voices', (req, res) => {
	if (voices) {
		res.send(voices)
	} else {
		res.status(500).send('Text-to-Speech error')
	}
})

// GET api/tts/langs
// Get Google TTS language codes
router.get('/langs', (req, res) => {
	if (languageCodes) {
		res.send(languageCodes)
	} else {
		res.status(500).send('Text-to-Speech error')
	}
})

// POST api/tts/synth
// Synthesize speech
// body: {text, languageCode, voice}
router.post('/synth', (req, res) => {
	const request = {
		input: { text: req.body.text },
		voice: { languageCode: req.body.languageCode, name: req.body.voice },
		audioConfig: { audioEncoding: MP3 },
	}
	if (ttsClient) {
		ttsClient
			.synthesizeSpeech(request)
			.then(([response]) => res.set({ 'Content-Type': 'audio/mp3' }).send(response.audioContent))
	} else {
		res.status(500).send('Text-to-Speech error')
	}
})

export default router

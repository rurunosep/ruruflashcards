import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import { google } from '@google-cloud/text-to-speech/build/protos/protos'

let ttsClient: TextToSpeechClient | undefined
let voices: google.cloud.texttospeech.v1.IVoice[] | undefined
let languageCodes: string[] | undefined

try {
	const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS!)

	ttsClient = new TextToSpeechClient({
		credentials: {
			client_email: credentials.client_email,
			private_key: credentials.private_key,
		},
		projectId: credentials.project_id,
	})

	ttsClient.listVoices().then(([response]) => {
		// For some reason, the response contains duplicate voices
		// Remove duplicates by putting them in a Map keyed by the "unique" voice name
		voices = [...new Map(response.voices?.map((v) => [v.name, v])).values()]
		languageCodes = [...new Set(voices.map((v) => v.languageCodes![0]))].sort()

		if (!ttsClient || !voices || !languageCodes) throw Error()
		console.log('Initialized TTS')
	})
} catch (err) {
	console.error('Failed to initalize TTS')
}

export { ttsClient, voices, languageCodes }

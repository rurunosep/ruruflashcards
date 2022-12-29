import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Options({
	ttsLanguage,
	ttsVoiceName,
	autoplayTts,
	reverseQuiz,
	setTtsLanguage,
	setTtsVoiceName,
	setAutoplayTts,
	setReverseQuiz,
}) {
	const [languages, setLanguages] = useState([])
	const [voices, setVoices] = useState([])
	const [filteredVoiceNames, setFilteredVoiceNames] = useState([])

	// Get language codes
	useEffect(() => {
		axios.get('/api/tts/langs').then((res) => setLanguages(res.data))
	}, [])

	// Get voices
	useEffect(() => {
		axios.get('/api/tts/voices').then((res) => setVoices(res.data))
	}, [])

	// Filter voices
	useEffect(() => {
		const filteredVoiceNames = voices
			.filter((voice) => voice.languageCodes.includes(ttsLanguage))
			.sort((a, b) => {
				if (a.name < b.name) return -1
				if (a.name > b.name) return 1
				return 0
			})
			.map((voice) => voice.name)
		setFilteredVoiceNames(filteredVoiceNames)
		// This condition is so that the voice name read from local storage is not
		// unset when voices are first loaded
		if (
			filteredVoiceNames &&
			filteredVoiceNames.length > 0 &&
			!filteredVoiceNames.includes(ttsVoiceName)
		) {
			setTtsVoiceName(filteredVoiceNames[0])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ttsLanguage, voices])

	return (
		<div className='card card-no-hover'>
			<div className='row margin-none flex-spaces'>
				<div className='col'>
					<label htmlFor='language'>TTS Language:</label>
					<select
						id='language'
						value={ttsLanguage}
						onChange={(e) => setTtsLanguage(e.target.value)}
					>
						{languages.map((lang) => (
							<option key={lang} value={lang}>
								{lang}
							</option>
						))}
					</select>
				</div>
				<div className='col'>
					<label htmlFor='voice'>TTS Voice:</label>
					<select id='voice' value={ttsVoiceName} onChange={(e) => setTtsVoiceName(e.target.value)}>
						{filteredVoiceNames.map((voice) => (
							<option key={voice} value={voice}>
								{voice}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className='row margin-none flex-spaces'>
				<div className='col'>
					<div className='form-group margin-none'>
						<label htmlFor='autoplay' className='paper-check'>
							<input
								type='checkbox'
								name='autoplay'
								id='autoplay'
								checked={autoplayTts}
								onChange={(e) => setAutoplayTts(e.target.checked)}
							/>
							<span>Autoplay TTS</span>
						</label>
					</div>
				</div>
				<div className='col'>
					<div className='form-group margin-none'>
						<label htmlFor='reverse' className='paper-check'>
							<input
								type='checkbox'
								name='reverse'
								id='reverse'
								checked={reverseQuiz}
								onChange={(e) => setReverseQuiz(e.target.checked)}
							/>
							<span>Quiz Back-to-Front</span>
						</label>
					</div>
				</div>
			</div>
		</div>
	)
}

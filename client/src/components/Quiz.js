import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Quiz({ cards, ttsLanguage, ttsVoiceName, autoplayTts, reverseQuiz }) {
	const [card, setCard] = useState(null)
	const [showNewCard, setShowNewCard] = useState(true)
	const [flipped, setFlipped] = useState(false)

	useEffect(() => {
		if (!card || !cards.some((c) => c._id === card._id)) setCard(null)
		if (!card) setShowNewCard(true)
		// eslint-disable-next-line
	}, [cards])

	// Show new card
	useEffect(() => {
		if (showNewCard) {
			const newCard = cards[Math.floor(Math.random() * cards.length)]
			setCard(newCard)
			if (newCard) setShowNewCard(false)
		}
		// eslint-disable-next-line
	}, [showNewCard, cards])

	// Autoplay TTS when a new card appears
	useEffect(() => {
		if (card && autoplayTts) {
			playTTS()
		}
		// eslint-disable-next-line
	}, [card])

	const playTTS = () => {
		if (!ttsLanguage || !ttsVoiceName || !card) return
		axios
			.post(
				'/api/tts/synth',
				{
					text: (reverseQuiz ? !flipped : flipped) ? card.back : card.front,
					languageCode: ttsLanguage,
					voice: ttsVoiceName,
				},
				{ responseType: 'blob' }
			)
			.then((res) => {
				const url = window.URL.createObjectURL(res.data)
				const audio = new Audio(url)
				audio.play()
			})
	}

	return (
		<div className='card card-no-hover margin-bottom' style={{}}>
			<button
				className='btn-small margin-none'
				popover-top='Play TTS'
				style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}
				onClick={playTTS}
			>
				<i className='flaticon-sound-hand-drawn-interface-symbol'></i>
			</button>
			<button
				className='btn-small margin-none'
				popover-top='Flip Card'
				style={{ position: 'absolute', top: '0.5rem' }}
				onClick={() => setFlipped(!flipped)}
			>
				<i className='flaticon-cycle-couple-of-arrows-hand-drawn-lines'></i>
			</button>
			<button
				className='btn-small margin-none'
				popover-top='Random Card'
				style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
				onClick={() => {
					setShowNewCard(true)
					setFlipped(false)
				}}
			>
				<i className='flaticon-arrow-pointing-to-right-hand-drawn-symbol'></i>
			</button>
			<div
				style={{
					display: 'flex',
					minHeight: '12rem',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<span style={{ fontSize: '2.5rem' }}>
					{/* It works. Don't worry about it. */}
					{card ? ((reverseQuiz ? !flipped : flipped) ? card.back : card.front) : ''}
				</span>
			</div>
		</div>
	)
}

import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import ErrorAlert from './ErrorAlert'
import Quiz from './Quiz'
import Options from './Options'
import CardsList from './CardsList'
import RegisterModal from './RegisterModal'
import AddCardModal from './AddCardModal'
import EditCardModal from './EditCardModal'
import Footer from './Footer'
import { ModalContextProvider } from '../context'

export interface Card {
	_id: string
	front: string
	back: string
}

export default function App() {
	const [username, setUsername] = useState<string | null>(null)
	const [cards, setCards] = useState([] as Card[])
	const [ttsLanguage, setTtsLanguage] = useState('fr-FR')
	const [ttsVoiceName, setTtsVoiceName] = useState<string | null>(null)
	const [autoplayTts, setAutoplayTts] = useState(false)
	const [reverseQuiz, setReverseQuiz] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	// Load options from local storage
	useEffect(() => {
		const options = JSON.parse(localStorage.getItem('options') || '{}')
		if (options) {
			setTtsLanguage(options.ttsLanguage)
			setTtsVoiceName(options.ttsVoiceName)
			setAutoplayTts(options.autoplayTts)
			setReverseQuiz(options.reverseQuiz)
		}
	}, [])

	// Save options to local storage
	useEffect(() => {
		localStorage.setItem(
			'options',
			JSON.stringify({ ttsLanguage, ttsVoiceName, autoplayTts, reverseQuiz })
		)
	}, [ttsLanguage, ttsVoiceName, autoplayTts, reverseQuiz])

	// Get username of the authenticated user of the current session
	useEffect(() => {
		axios.get('api/auth/user').then((res) => {
			setUsername(res.data ? res.data : null)
		})
	}, [])

	// Load cards from api
	useEffect(() => {
		axios
			.post('/api/graphql', {
				query: `
					{
						cards {
							_id
							front
							back
						}
					}
				`,
			})
			.then((res) => {
				setCards(res.data.data.cards || [])
			})
	}, [username])

	const addCard = useCallback((front: string, back: string) => {
		axios
			.post('/api/graphql', {
				query: `
					mutation {
						add_card(front: "${front}", back: "${back}") {
							_id
						}	
					}
				`,
			})
			.then((res) => {
				setCards((cards) => [...cards, { _id: res.data.data.add_card._id, front, back }])
			})
	}, [])

	const editCard = useCallback((_id: string, changes: { front?: string; back?: string }) => {
		const front = changes.front || 'null'
		const back = changes.back || 'null'
		axios
			.post('/api/graphql', {
				query: `
					mutation {
						edit_card(_id: "${_id}", front: "${front}", back: "${back}") {
							_id
						}
					}
			`,
			})
			.then((res) =>
				setCards((cards) => cards.map((c) => (c._id === _id ? { ...c, ...changes } : c)))
			)
	}, [])

	const deleteCard = useCallback((_id: string) => {
		axios
			.post(`/api/graphql`, {
				query: `
					mutation {
						delete_card(_id: "${_id}") {
							_id
						}
					}
				`,
			})
			.then((res) => setCards((cards) => [...cards.filter((c) => c._id !== _id)]))
	}, [])

	const login = useCallback((username: string, password: string) => {
		axios
			.post('api/auth/login', { username, password })
			.then((res) => {
				setUsername(username)
			})
			.catch((err) => {
				setErrorMessage(err.response.data)
			})
	}, [])

	const logout = useCallback(() => {
		axios.get('api/auth/logout').then((res) => {
			setUsername(null)
			setCards([])
		})
	}, [])

	const register = useCallback((username: string, password: string) => {
		axios
			.post('api/auth/register', { username, password })
			.then((res) => {
				setUsername(username)
			})
			.catch((err) => {
				setErrorMessage(err.response.data)
			})
	}, [])

	return (
		<React.StrictMode>
			<ModalContextProvider>
				<Navbar username={username} login={login} logout={logout} />
				<ErrorAlert errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
				{username && (
					<div className='row flex-center margin-none'>
						<div className='sm-col margin-small' style={{ width: '25rem' }}>
							<Quiz
								cards={cards}
								ttsLanguage={ttsLanguage}
								ttsVoiceName={ttsVoiceName}
								autoplayTts={autoplayTts}
								reverseQuiz={reverseQuiz}
							/>
							<Options
								ttsLanguage={ttsLanguage}
								ttsVoiceName={ttsVoiceName}
								autoplayTts={autoplayTts}
								reverseQuiz={reverseQuiz}
								setTtsLanguage={setTtsLanguage}
								setTtsVoiceName={setTtsVoiceName}
								setAutoplayTts={setAutoplayTts}
								setReverseQuiz={setReverseQuiz}
							/>
						</div>
						<div className='sm-col margin-small' style={{ width: '25rem' }}>
							<CardsList cards={cards} />
						</div>
					</div>
				)}
				<Footer />
				<RegisterModal register={register} setErrorMessage={setErrorMessage} />
				<AddCardModal addCard={addCard} />
				<EditCardModal editCard={editCard} deleteCard={deleteCard} />
			</ModalContextProvider>
		</React.StrictMode>
	)
}
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import ErrorAlert from './ErrorAlert'
import Quiz from './Quiz'
import Options from './Options'
import CardsList from './CardsList'
import Footer from './Footer'
import RegisterModal from './RegisterModal'
import AddCardModal from './AddCardModal'
import EditCardModal from './EditCardModal'
import { ModalContext } from '../contexts'

import axios from 'axios'

export default function App() {
	const [username, setUsername] = useState(null)
	const [cards, setCards] = useState([])
	const [ttsLanguage, setTtsLanguage] = useState('fr-FR')
	const [ttsVoice, setTtsVoice] = useState(null)
	const [autoplayTts, setAutoplayTts] = useState(false)
	const [reverseQuiz, setReverseQuiz] = useState(false)
	const [addCardModalOpen, setAddCardModalOpen] = useState(false)
	const [editCardModalOpen, setEditCardModalOpen] = useState(false)
	const [cardToEdit, setCardToEdit] = useState(null)
	const [registerModalOpen, setRegisterModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState(null)

	// Load options from local storage
	useEffect(() => {
		const options = JSON.parse(localStorage.getItem('options'))
		if (options) {
			setTtsLanguage(options.ttsLanguage)
			setTtsVoice(options.ttsVoice)
			setAutoplayTts(options.autoplayTts)
			setReverseQuiz(options.reverseQuiz)
		}
	}, [])

	// Save options to local storage
	useEffect(() => {
		localStorage.setItem(
			'options',
			JSON.stringify({ ttsLanguage, ttsVoice, autoplayTts, reverseQuiz })
		)
	}, [ttsLanguage, ttsVoice, autoplayTts, reverseQuiz])

	// Get username of the authenticated user of the current session
	useEffect(() => {
		axios.get('api/auth/user').then((res) => {
			setUsername(res.data ? res.data : null)
		})
	}, [])

	// Load cards from api
	useEffect(() => {
		axios.get('/api/cards').then((res) => {
			setCards(res.data)
		})
	}, [username])

	const addCard = (front, back) => {
		axios.post('/api/cards', { front, back }).then((res) => {
			setCards([...cards, { _id: res.data, front, back }])
		})
	}

	const editCard = (_id, changes) => {
		axios
			.put(`/api/cards/${_id}`, changes)
			.then((res) => setCards(cards.map((c) => (c._id === _id ? { ...c, ...changes } : c))))
	}

	const deleteCard = (_id) => {
		axios
			.delete(`/api/cards/${_id}`)
			.then((res) => setCards([...cards.filter((c) => c._id !== _id)]))
	}

	const login = (username, password) => {
		axios
			.post('api/auth/login', { username, password })
			.then((res) => {
				setUsername(username)
			})
			.catch((err) => {
				setErrorMessage(err.response.data)
			})
	}

	const logout = () => {
		axios.get('api/auth/logout').then((res) => {
			setUsername(null)
			setCards([])
		})
	}

	const register = (username, password) => {
		axios
			.post('api/auth/register', { username, password })
			.then((res) => {
				setUsername(username)
			})
			.catch((err) => {
				setErrorMessage(err.response.data)
			})
	}

	return (
		<>
			<ModalContext.Provider
				value={{
					addCardModalOpen,
					setAddCardModalOpen,
					editCardModalOpen,
					setEditCardModalOpen,
					cardToEdit,
					setCardToEdit,
					registerModalOpen,
					setRegisterModalOpen,
				}}
			>
				<Navbar username={username} login={login} logout={logout} />
				<ErrorAlert errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
				{username && (
					<div className='row flex-center margin-none'>
						<div className='sm-col margin-small' style={{ width: '25rem' }}>
							<Quiz
								cards={cards}
								ttsLanguage={ttsLanguage}
								ttsVoice={ttsVoice}
								autoplayTts={autoplayTts}
								reverseQuiz={reverseQuiz}
							/>
							<Options
								ttsLanguage={ttsLanguage}
								ttsVoice={ttsVoice}
								autoplayTts={autoplayTts}
								reverseQuiz={reverseQuiz}
								setTtsLanguage={setTtsLanguage}
								setTtsVoice={setTtsVoice}
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
			</ModalContext.Provider>
		</>
	)
}

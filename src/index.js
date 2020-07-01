import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { TextToSpeechClient, AudioEncoding } from '@google-cloud/text-to-speech'
import { google } from '@google-cloud/text-to-speech/build/protos/protos'
import { JWT } from 'google-auth-library'
import './index.css'

function EditableCardListRow({ card, editCard, deleteCard, setUneditable }) {
  const [fields, setFields] = useState({ front: card.front, back: card.back })

  return (
    <>
      <td>
        <input
          type="text"
          value={fields.front}
          onChange={(e) => setFields({ ...fields, front: e.target.value })}
        />
      </td>
      <td>
        <input
          type="text"
          value={fields.back}
          onChange={(e) => setFields({ ...fields, back: e.target.value })}
        />
      </td>
      <td>
        <button onClick={() => {
          editCard(fields)
          setUneditable()
        }}
        >
          Save
        </button>
      </td>
      <td>
        <button onClick={deleteCard}>Delete</button>
      </td>
    </>
  )
}

function UneditableCardListRow({ card, setEditable }) {
  return (
    <>
      <td>{card.front}</td>
      <td>{card.back}</td>
      <td>
        <button onClick={setEditable}>Edit</button>
      </td>
    </>
  )
}

function CardsListRow({ card, editCard, deleteCard }) {
  const [editable, setEditable] = useState(false)

  const row = editable ? (
    <EditableCardListRow
      card={card}
      editCard={editCard}
      deleteCard={() => {
        deleteCard()
        setEditable(false)
      }}
      setUneditable={() => setEditable(false)}
    />
  ) : (
      <UneditableCardListRow card={card} setEditable={() => setEditable(true)} />
    )

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={card.enabled}
          onChange={(e) => editCard({ enabled: e.target.checked })}
        />
      </td>
      {row}
    </tr>
  )
}

function AddCardForm({ addCard }) {
  const [fields, setFields] = useState({ front: '', back: '' })

  const onSubmit = (e) => {
    e.preventDefault()
    addCard(fields)
    setFields({ front: '', back: '' })
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Front"
        value={fields.front}
        onChange={(e) => setFields({ ...fields, front: e.target.value })}
      />
      <input
        type="text"
        placeholder="Back"
        value={fields.back}
        onChange={(e) => setFields({ ...fields, back: e.target.value })}
      />
      <input type="submit" value="Add Card" />
    </form>
  )
}

function CardsList({ cards, addCard, editCard, deleteCard, setAllCardsEnabled, swapAllFields }) {
  const [addingCard, setAddingCard] = useState(false)

  return (
    <div>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th></th>
            <th>Front</th>
            <th>Back</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card, index) => (
            <CardsListRow
              card={card}
              editCard={(changes) => editCard(index, changes)}
              deleteCard={() => deleteCard(index)}
              key={card.front}
            />
          ))}
        </tbody>
      </table>

      {addingCard ? (
        <AddCardForm
          addCard={(fields) => {
            addCard(fields)
            setAddingCard(false)
          }}
        />
      ) : (
          <div>
            <button onClick={() => setAddingCard(true)}>New Card</button>
          </div>
        )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setAllCardsEnabled(true)}>Enable All</button>
        <button onClick={() => setAllCardsEnabled(false)}>Disable All</button>
        <button onClick={swapAllFields}>Swap Fields</button>
      </div>
    </div>
  )
}

// TODO: rename?
function CardDisplay({ card, showNewCard, editCard }) {
  const [flipped, setFlipped] = useState(false)

  if (!card) card = { front: '', back: '' }

  const playTTS = async function (text) {
    const request = {
      input: { text: text },
      voice: { languageCode: 'ko-KR', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: google.cloud.texttospeech.v1.AudioEncoding.MP3 },
    };

    const [response] = await ttsClient.synthesizeSpeech(request)
    const blob = new Blob([response.audioContent], { type: 'audio/mp3' })
    const url = window.URL.createObjectURL(blob)
    const audio = new Audio(url)
    audio.play()
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 300,
          height: 200,
        }}
      >
        <h1 style={{ margin: 0 }}>{flipped ? card.back : card.front}</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setFlipped(!flipped)}>Flip</button>
        <button
          onClick={() => {
            showNewCard()
            setFlipped(false)
          }}
        >
          Next
        </button>
        <button
          onClick={() => {
            editCard({ enabled: false })
            showNewCard()
          }}
        >
          Disable
        </button>
        <button onClick={() => { playTTS(card.front) }}>
          Play
        </button>
      </div>
    </div>
  )
}

function App({ initialCards }) {
  const [cards, setCards] = useState(initialCards)
  const [listVisible, setListVisible] = useState(true)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [shouldShowNewCard, setShouldShowNewCard] = useState(false)

  useEffect(
    function saveCardsToLocalStorage() {
      localStorage.setItem('cards', JSON.stringify(cards))
    },
    [cards]
  )

  useEffect(
    function showRandomCard() {
      if (shouldShowNewCard) {
        let newCardIndex = null
        if (cards.filter((card) => card.enabled).length > 0) {
          do {
            newCardIndex = Math.floor(Math.random() * cards.length)
          } while (!cards[newCardIndex].enabled)
        }
        setCurrentCardIndex(newCardIndex)
        setShouldShowNewCard(false)
      }
    },
    [shouldShowNewCard]
  )

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div>
        <CardDisplay
          card={cards[currentCardIndex]}
          showNewCard={() => setShouldShowNewCard(true)}
          editCard={(changes) =>
            setCards(
              cards.map((card, i) =>
                currentCardIndex === i ? { ...card, ...changes } : card
              )
            )
          }
        />
      </div>

      <div
        style={{
          minWidth: 300,
          margin: 20
        }}
      >
        <button onClick={() => setListVisible(!listVisible)}>
          {listVisible ? 'Hide List' : 'Show List'}
        </button>
        {listVisible && (
          <CardsList
            cards={cards}
            addCard={(fields) =>
              setCards([...cards, { enabled: true, ...fields }])
            }
            editCard={(index, changes) => {
              setCards(
                cards.map((card, i) =>
                  index === i ? { ...card, ...changes } : card
                )
              )
            }}
            deleteCard={(index) => {
              setCards(cards.filter((card, i) => index !== i))
            }}
            setAllCardsEnabled={(enabled) => {
              setCards(cards.map((card) => ({ ...card, enabled: enabled })))
            }}
            swapAllFields={() => {
              setCards(
                cards.map((card) => ({
                  ...card,
                  front: card.back,
                  back: card.front,
                }))
              )
            }}
          />
        )}
      </div>
    </div>
  )
}

let initialCards = JSON.parse(localStorage.getItem('cards'))
if (!initialCards) {
  initialCards = [
    { enabled: true, front: '개', back: 'Dog' },
    { enabled: true, front: '고양이', back: 'Cat' },
    { enabled: true, front: '물고기', back: 'Fish' },
  ]
}

// TODO: clean this TTS initialization up

const authJSON = {
  type: "service_account",
  project_id: "ruruflashcards",
  private_key_id: "acceae75f2711f9eeb724520248a9cf779f8d8cc",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDR/q75TPMsWUen\nBZg+FJQRCjSvPM1cpKl954Svp1hOIw2xjIHqXw1d/f1obXmgjgU4iYW8x/IJCfsK\nGUGWUF418ad1X113rGoaHQQpakjOubbeg9j4GAKjAeVz8XDK34oFYFJ997Bsl3rg\nm6np6eQ1+q2zKq2JH82aRMDD5YeBFUlTKPqfkRw4BPPdYHtYQhlh/vu+QbRww2tW\n0hsc4EY+GeC0AwUXRcjzY+UAreWRgM9uAJI+Lqv47iI//NmvEYKWdecIbYcruxKp\n4D8qTCdMrYPLF9kDK1jYUsklsqe51G4FZFwEXbOTV1GQBn133JVEzsLl1dHr2zCJ\nz7BXr1qvAgMBAAECggEARnjTbIuD4gK2Npl8jXzncc58fsCHZItH7B5Jm48r5dEC\ns+5k3Ov4Nu5ZX/W5RwXSP7Z7IK7zDVCBpFJ0fcbLzwuheJS/77z3QHszXdiyxVly\nwrr5kcyw+dZVk/LXOOYK0iIQnQCF/vNZA86Jl5vr/6d4KnPsl+OJ4rcm/7bkIg+Q\nexuGpLaONQiF2NIvQq/pi5HdZHq+iTF80tn7UfnuAm+J4jY6/npVRYXJXbunonzG\npPewvrGNGjCCjvGf0yPXKiOwKSkjuCTN4TH+VJZZSGV/rhmoYTkf7hZXDHihfEix\nQQ/UdomJTMljPPkpHsg/U/fRsIB2qpsSR0jtxSx5xQKBgQDwRS3M1VkdBzdxaSKN\nfLq09kAZc70j1h2ctrJPHa2YCFHJjOEmhEaN/twyHlXcVb1dMVnfwUwxeO5UZhwS\n3CI3VI18u3vMr0KVHCgtCIeWVeNnlaJ8yw8V2vqkfuTjgGYWpCY2Qo411SOam3Vl\nzJoDFKx7+zgi/XxXjK0mxEWQnQKBgQDfvhpaaIeFWZd/GQmxzy1SHhSBvCNfUOpC\nt4i7xvyIRY8NO5r6q5aM9xEenDyzl4nc01kIswqOhgKH34VuICa5mOHXUJz1CXUe\n1a7/TzUhZ8GeOWl7Z1JGPw29bpfUAkeRlmmTRwunRSDgF46kJQUNrBQgg1WOKg5/\n2NhtF5AYuwKBgQCpeuK3nbZiN3jwUozA6L56b0j/qxg7cwkoRea4z+JnX1bxqKIY\nnS13c9K2t5cw+Hm+htUydBLewsK6XdxnoUexZ771wPmug+GfdGESgvXBIYxqwK4B\nAOr/K5uo9KlXoHZieh9KHuBZMKMQp5/D0vLAQZD5U1dhtxRCXUS2F7RKMQKBgQCf\nOLusRuLaRM2IxxqdDKBl5b4WLPrHI9/xpoaJiqu/ljCc7CP36w/yNQhbzjdsXpTf\nLxAXHsKOdlNquehMXFjyjxd4kIeB4T8VuF8WlRlsMlgY7yZfiUGFd+2hNwiY+R5R\nPsbW5iIm4QzqLBl4OlgESMbx9ER4LPmwhXJPAAutbQKBgQDPJLj6dIVLoimBydpv\nlv8V94Hfh3oLSoaMIu5ONOUjbYReE5/gZfsJ9wv2BKEmdhxTcDyEEo4Vjx1MK0zD\nk2uWGNebIkjHY+um/rRVzc/TRAUR4GSwWjzX3NNzVTxkhMj11zxpyruNU3Vo+UwU\ns7LkwlgtHEbLEa59eP+tojg8OA==\n-----END PRIVATE KEY-----\n",
  client_email: "ruruflashcards-user@ruruflashcards.iam.gserviceaccount.com",
  client_id: "108355697865110828466",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/ruruflashcards-user%40ruruflashcards.iam.gserviceaccount.com"
}

const authClient = new JWT({
  email: authJSON.client_email,
  key: authJSON.private_key,
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
})

const ttsClient = new TextToSpeechClient({ auth: authClient })

ReactDOM.render(
  <App initialCards={initialCards} />,
  document.getElementById('root')
)

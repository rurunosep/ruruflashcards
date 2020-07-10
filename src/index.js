import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { v4 as uuidv4 } from 'uuid'
import TTS from './tts.js'
import './index.css'

function EditableCardListRow({ card, editCard, deleteCard, setUneditable }) {
  const [fields, setFields] = useState({ front: card.front, back: card.back })

  return (
    <>
      <td>
        <input
          type='text'
          value={fields.front}
          onChange={(e) => setFields({ ...fields, front: e.target.value })}
        />
      </td>
      <td>
        <input
          type='text'
          value={fields.back}
          onChange={(e) => setFields({ ...fields, back: e.target.value })}
        />
      </td>
      <td>
        <button
          onClick={() => {
            editCard(fields)
            setUneditable()
          }}>
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
          type='checkbox'
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
        type='text'
        placeholder='Front'
        value={fields.front}
        onChange={(e) => setFields({ ...fields, front: e.target.value })}
      />
      <input
        type='text'
        placeholder='Back'
        value={fields.back}
        onChange={(e) => setFields({ ...fields, back: e.target.value })}
      />
      <input type='submit' value='Add Card' />
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
              key={card.id}
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

function TTSOptions({ filteredVoices, selectedLanguage, selectedVoice, setLanguage, setVoice }) {
  return (
    <div style={{ marginTop: 5 }}>
      <label>Language: </label>
      <select value={selectedLanguage} onChange={(e) => setLanguage(e.target.value)}>
        {TTS.languageCodes.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <label>Voice: </label>
      <select value={selectedVoice} onChange={(e) => setVoice(e.target.value)}>
        {filteredVoices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </select>
    </div>
  )
}

// TODO: rename or restructure?
function CardDisplay({ card, showNewCard, editCard }) {
  const [flipped, setFlipped] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en-AU')
  const [selectedVoice, setSelectedVoice] = useState()

  const filteredVoices = TTS.voices
    .filter((voice) => voice.languageCodes.includes(selectedLanguage))
    .sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })

  useEffect(() => {
    setSelectedVoice(filteredVoices[0])
  }, [selectedLanguage, filteredVoices])

  if (!card) card = { front: '', back: '' }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 300,
          height: 200,
        }}>
        <h1 style={{ margin: 0 }}>{flipped ? card.back : card.front}</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setFlipped(!flipped)}>Flip</button>
        <button
          onClick={() => {
            showNewCard()
            setFlipped(false)
          }}>
          Next
        </button>
        <button
          onClick={() => {
            editCard({ enabled: false })
            setFlipped(false)
            showNewCard()
          }}>
          Disable
        </button>
        <button
          onClick={() =>
            TTS.play(flipped ? card.back : card.front, selectedLanguage, selectedVoice)
          }
          disabled={!TTS.client}>
          Play
        </button>
      </div>

      {TTS.client && (
        <TTSOptions
          filteredVoices={filteredVoices}
          selectedLanguage={selectedLanguage}
          selectedVoice={selectedVoice}
          setLanguage={setSelectedLanguage}
          setVoice={setSelectedVoice}
        />
      )}
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
    [shouldShowNewCard, cards]
  )

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
      <CardDisplay
        card={cards[currentCardIndex]}
        showNewCard={() => setShouldShowNewCard(true)}
        editCard={(changes) =>
          setCards(
            cards.map((card, i) => (currentCardIndex === i ? { ...card, ...changes } : card))
          )
        }
      />

      <div
        style={{
          minWidth: 300,
          margin: 20,
        }}>
        <button onClick={() => setListVisible(!listVisible)}>
          {listVisible ? 'Hide List' : 'Show List'}
        </button>
        {listVisible && (
          <CardsList
            cards={cards}
            addCard={(fields) => setCards([...cards, { ...fields, id: uuidv4(), enabled: true }])}
            editCard={(index, changes) => {
              setCards(cards.map((card, i) => (index === i ? { ...card, ...changes } : card)))
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

async function main() {
  let initialCards = JSON.parse(localStorage.getItem('cards'))
  if (!initialCards) {
    initialCards = [
      { front: '개', back: 'Dog', id: uuidv4(), enabled: true },
      { front: '고양이', back: 'Cat', id: uuidv4(), enabled: true },
      { front: '물고기', back: 'Fish', id: uuidv4(), enabled: true },
    ]
  }

  await TTS.initialize()

  ReactDOM.render(<App initialCards={initialCards} />, document.getElementById('root'))
}

main()

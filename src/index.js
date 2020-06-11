import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

function EditableCardListRow({ card, editCard, deleteCard, setUneditable }) {
  const [fields, setFields] = useState({ front: card.front, back: card.back })

  return (
    <>
      <td><input
        type='text'
        value={fields.front}
        onChange={(e) => setFields({ ...fields, front: e.target.value })} /></td>
      <td><input
        type='text'
        value={fields.back}
        onChange={(e) => setFields({ ...fields, back: e.target.value })} /></td>
      <td><button onClick={() => {
        editCard(fields)
        setUneditable()
      }}>Save</button></td>
      <td><button onClick={deleteCard}>Delete</button></td>
    </>
  )
}

function UneditableCardListRow({ card, setEditable }) {
  return (
    <>
      <td>{card.front}</td>
      <td>{card.back}</td>
      <td><button onClick={setEditable}>Edit</button></td>
    </>
  )
}

function CardsListRow({ card, editCard, deleteCard }) {
  const [editable, setEditable] = useState(false)

  // TODO: rename/cleanup/whatever
  const row = editable
    ? <EditableCardListRow
      card={card}
      editCard={(changes) => {
        editCard(changes)
      }}
      deleteCard={() => {
        deleteCard()
        setEditable(false)
      }}
      setUneditable={() => setEditable(false)} />
    : <UneditableCardListRow
      card={card}
      setEditable={() => setEditable(true)} />

  return (
    <tr>
      <td><input
        type='checkbox'
        checked={card.enabled}
        onChange={(e) => editCard({ enabled: e.target.checked })} /></td>
      {row}
    </tr>
  )
}

function AddCardForm({ addCard }) {
  const [fields, setFields] = useState({ front: '', back: '' })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      addCard(fields)
      setFields({ front: '', back: '' })
    }}>
      <input
        type='text'
        placeholder='Front'
        value={fields.front}
        onChange={(e) => setFields({ ...fields, front: e.target.value })} />
      <input
        type='text'
        placeholder='Back'
        value={fields.back}
        onChange={(e) => setFields({ ...fields, back: e.target.value })} />
      <input type='submit' value='Add Card' />
    </form >
  )
}

function CardsList({ cards, addCard, editCard, deleteCard, setAllCardsEnabled, swapAllFields }) {
  const [addingCard, setAddingCard] = useState(false)

  return (
    <div>
      <table>
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
              key={card.front} />
          ))}
        </tbody>
      </table>
      {addingCard
        ? <AddCardForm addCard={(fields) => {
          addCard(fields)
          setAddingCard(false)
        }} />
        : <div><button onClick={() => setAddingCard(true)}>New Card</button></div>}
      <button onClick={() => setAllCardsEnabled(true)}>Enable All</button>
      <button onClick={() => setAllCardsEnabled(false)}>Disable All</button>
      <button onClick={swapAllFields}>Swap Fields</button>
    </div>
  )
}

// TODO: rename?
function CardDisplay({ card, showNewCard, editCard }) {
  const [flipped, setFlipped] = useState(false)

  if (!card) card = { front: '', back: '' }

  return (
    <div>
      <h1>{flipped ? card.back : card.front}</h1>
      <button onClick={() => setFlipped(!flipped)}>Flip</button>
      <button onClick={() => {
        showNewCard()
        setFlipped(false)
      }}>Next</button>
      <button onClick={() => {
        editCard({ enabled: false })
        showNewCard()
      }}>Disable</button>
      <hr></hr>
    </div>
  )
}

function App({ initialCards }) {
  const [cards, setCards] = useState(initialCards)
  const [listVisible, setListVisible] = useState(true)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [shouldShowNewCard, setShouldShowNewCard] = useState(false)

  // TODO: ASK ALEX about named/anonymous/comment conventions here
  useEffect(function saveCardsToLocalStorage() {
    localStorage.setItem('cards', JSON.stringify(cards))
  }, [cards])

  // TODO: ASK ALEX if this is the best way to do this ("should" bool in state and a hook)
  useEffect(function showRandomCard() {
    if (shouldShowNewCard) {
      let newCardIndex = null
      if (cards.filter(card => card.enabled).length > 0) {
        do {
          newCardIndex = Math.floor(Math.random() * cards.length)
        } while (!cards[newCardIndex].enabled)
      }
      setCurrentCardIndex(newCardIndex)
      setShouldShowNewCard(false)
    }
  })

  // TODO: do CSS shit to make the card and list display side by side
  return (
    <div>
      <CardDisplay
        card={cards[currentCardIndex]}
        showNewCard={() => setShouldShowNewCard(true)}
        editCard={(changes) => {
          setCards(cards.map((card, i) => {
            return currentCardIndex === i ? { ...card, ...changes } : card
          }))
        }} />
      <button onClick={() => setListVisible(!listVisible)}>
        {listVisible ? 'Hide List' : 'Show List'}
      </button>
      {listVisible &&
        <CardsList
          cards={cards}
          addCard={(fields) => {
            setCards([...cards, { enabled: true, ...fields }])
          }}
          editCard={(index, changes) => {
            setCards(cards.map((card, i) => {
              return index === i ? { ...card, ...changes } : card
            }))
          }}
          deleteCard={(index) => {
            setCards(cards.filter((card, i) => {
              return index !== i
            }))
          }}
          setAllCardsEnabled={(enabled) => {
            setCards(cards.map((card) => {
              return { ...card, enabled: enabled }
            }))
          }}
          swapAllFields={() => {
            setCards(cards.map((card) => {
              return { ...card, front: card.back, back: card.front }
            }))
          }} />}
      <br />
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

ReactDOM.render(
  <App initialCards={initialCards} />,
  document.getElementById('root')
)
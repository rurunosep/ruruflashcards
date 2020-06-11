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
        checked={card.active}
        onChange={(e) => editCard({ active: e.target.checked })} /></td>
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

function CardsList({ cards, addCard, editCard, deleteCard, setAllCardsActive }) {
  return (
    <div>
      <AddCardForm addCard={addCard} />
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
      <button onClick={() => setAllCardsActive(true)}>All Active</button>
      <button onClick={() => setAllCardsActive(false)}>All Inactive</button>
    </div>
  )
}

// TODO: rename
function CardDisplay({ card, showNextCard, editCard }) {
  const [flipped, setFlipped] = useState(false)

  if (!card) card = { front: '', back: '' }

  return (
    <div>
      <h1>{flipped ? card.back : card.front}</h1>
      <button onClick={() => setFlipped(!flipped)}>Flip</button>
      <button onClick={() => {
        showNextCard()
        setFlipped(false)
      }}>Next</button>
      <button onClick={() => {
        editCard({ active: false })
        // TODO: updating state is async and hasn't finished yet. card is still active
        // and if it was the only active one left, showNextCard will show the same one
        showNextCard()
      }}>Set Inactive</button>
      <hr></hr>
    </div>
  )
}

function App({ initialCards }) {
  const [cards, setCards] = useState(initialCards)
  const [listVisible, setListVisible] = useState(true)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards))
  }, [cards])

  // TODO: do CSS shit to make the card and list display side by side
  return (
    <div>
      <CardDisplay
        card={cards[currentCardIndex]}
        showNextCard={() => {
          //TODO: pull this out?
          let nextCardIndex = null
          if (cards.filter(card => card.active).length > 0) {
            nextCardIndex = currentCardIndex
            do {
              nextCardIndex = nextCardIndex < cards.length - 1 ? nextCardIndex + 1 : 0
            } while (!cards[nextCardIndex].active)
          }
          setCurrentCardIndex(nextCardIndex)
        }}
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
          addCard={(card) => {
            setCards([...cards, { active: true, ...card }])
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
          setAllCardsActive={(active) => {
            setCards(cards.map((card) => {
              return { ...card, active: active }
            }))
          }} />}
    </div>
  )
}

let initialCards = JSON.parse(localStorage.getItem('cards'))
if (!initialCards) {
  initialCards = [
    { active: true, front: 'Dog', back: '개' },
    { active: true, front: 'Cat', back: '고양이' },
    { active: true, front: 'Fish', back: '물고기' },
  ]
}

ReactDOM.render(
  <App initialCards={initialCards} />,
  document.getElementById('root')
)
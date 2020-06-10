import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

function EditableCardListRow({ card, saveCard, deleteCard }) {
  const [fields, setFields] = useState(card)

  return (
    <tr>
      <td><input
        type='text'
        name='front'
        value={fields.front}
        onChange={(e) => setFields({ ...fields, front: e.target.value })} /></td>
      <td><input
        type='text'
        name='back'
        value={fields.back}
        onChange={(e) => setFields({ ...fields, back: e.target.value })} /></td>
      <td><button onClick={() => saveCard(fields)}>Save</button></td>
      <td><button onClick={deleteCard}>Delete</button></td>
    </tr>
  )
}

function UneditableCardListRow({ card, setEditable }) {
  return (
    <tr>
      <td>{card.front}</td>
      <td>{card.back}</td>
      <td><button onClick={setEditable}>Edit</button></td>
    </tr>
  )
}

function CardsListRow({ card, editCard, deleteCard }) {
  const [editable, setEditable] = useState(false)

  if (editable) {
    return (
      <EditableCardListRow
        card={card}
        saveCard={(newCard) => {
          editCard(newCard)
          setEditable(false)
        }}
        deleteCard={() => {
          deleteCard()
          setEditable(false)
        }} />
    )
  } else {
    return (
      <UneditableCardListRow
        card={card}
        setEditable={() => setEditable(true)} />
    )
  }
}

function CardsList({ cards, editCard, deleteCard }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Front</th>
          <th>Back</th>
        </tr>
      </thead>
      <tbody>
        {cards.map((card, index) => (
          <CardsListRow
            card={card}
            editCard={(newCard) => editCard(index, newCard)}
            deleteCard={() => deleteCard(index)}
            key={index} />
        ))}
      </tbody>
    </table>
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
        name='front'
        placeholder='Front'
        value={fields.front}
        onChange={(e) => setFields({ ...fields, front: e.target.value })} />
      <input
        type='text'
        name='back'
        placeholder='Back'
        value={fields.back}
        onChange={(e) => setFields({ ...fields, back: e.target.value })} />
      <input type='submit' value='Add Card' />
    </form >
  )
}

// TODO: rename
function CardDisplay({ card, showNextCard }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div>
      <h1>{flipped ? card.back : card.front}</h1>
      <button onClick={() => setFlipped(!flipped)}>Flip Card</button>
      <button onClick={() => {
        showNextCard()
        setFlipped(false)
      }}>Next Card</button>
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
        showNextCard={() => (
          setCurrentCardIndex(currentCardIndex < cards.length - 1 ? currentCardIndex + 1 : 0)
        )} />
      <button onClick={() => setListVisible(!listVisible)}>
        {listVisible ? 'Hide List' : 'Show List'}
      </button>
      {listVisible &&
        <div>
          <AddCardForm
            addCard={(card) => {
              setCards([...cards, card])
            }} />
          <CardsList
            cards={cards}
            deleteCard={(index) => {
              setCards(cards.filter((card, i) => {
                return index !== i
              }))
            }}
            editCard={(index, newCard) => {
              setCards(cards.map((card, i) => {
                return index === i ? newCard : card
              }))
            }} />
        </div>}
    </div>
  )
}

let initialCards = JSON.parse(localStorage.getItem('cards'))
if (!initialCards) {
  initialCards = [
    { front: 'Dog', back: '개' },
    { front: 'Cat', back: '고양이' },
    { front: 'Fish', back: '물고기' },
  ]
}

ReactDOM.render(
  <App initialCards={initialCards} />,
  document.getElementById('root')
)
import React from 'react'
import ReactDOM from 'react-dom'

function EditableCardListRow({ card, saveCard, deleteCard }) {
  const [front, setFront] = React.useState(card.front)
  const [back, setBack] = React.useState(card.back)

  return (
    <tr>
      <td><input
        type='text'
        name='front'
        value={front}
        onChange={(e) => setFront(e.target.value)} /></td>
      <td><input
        type='text'
        name='back'
        value={back}
        onChange={(e) => setBack(e.target.value)} /></td>
      <td><button onClick={() => saveCard({ front: front, back: back })}>Save</button></td>
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

function CardsListRow({ card, editCard, ...props }) {
  const [editable, setEditable] = React.useState(false)

  let saveCard = (newCard) => {
    editCard(newCard)
    setEditable(false)
  }

  // TODO: what's the best way to handle these names?
  let deleteCard = () => {
    props.deleteCard()
    setEditable(false)
  }

  if (editable) {
    return (
      <EditableCardListRow
        card={card}
        saveCard={saveCard}
        deleteCard={deleteCard} />
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
  const [front, setFront] = React.useState('')
  const [back, setBack] = React.useState('')

  let handleSubmit = (e) => {
    e.preventDefault()
    addCard({ front: front, back: back })
    setFront('')
    setBack('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        name='front'
        placeholder='Front'
        value={front}
        onChange={(e) => setFront(e.target.value)} />
      <input
        type='text'
        name='back'
        placeholder='Back'
        value={back}
        onChange={(e) => setBack(e.target.value)} />
      <input type='submit' value='Add Card' />
    </form >
  )
}

// TODO: rename
function CardDisplay({ card, displayNextCard }) {
  const [flipped, setFlipped] = React.useState(false)

  let showNextCard = () => {
    displayNextCard()
    setFlipped(false)
  }

  return (
    <div>
      <h1>{flipped ? card.back : card.front}</h1>
      <button onClick={() => setFlipped(!flipped)}>Flip Card</button>
      <button onClick={showNextCard}>Next Card</button>
      <hr></hr>
    </div>
  )
}

const initialCards = [
  { front: 'Dog', back: '개' },
  { front: 'Cat', back: '고양이' },
  { front: 'Fish', back: '물고기' },
]

function App(props) {
  const [cards, setCards] = React.useState(initialCards)
  const [listVisible, setListVisible] = React.useState(true)
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0)

  let deleteCard = (indexToDelete) => {
    setCards(cards.filter((card, index) => {
      return index !== indexToDelete
    }))
  }

  let addCard = (card) => {
    setCards([...cards, card])
  }

  let editCard = (indexToEdit, newCard) => {
    setCards(cards.map((card, index) => {
      return index === indexToEdit ? newCard : card
    }))
  }

  let showNextCard = () => {
    setCurrentCardIndex(currentCardIndex < cards.length - 1 ? currentCardIndex + 1 : 0)
  }

  // TODO: do CSS shit to make the card and list side by side
  return (
    <div>
      <CardDisplay
        card={cards[currentCardIndex]}
        displayNextCard={showNextCard} />
      <button onClick={() => setListVisible(!listVisible)}>
        {listVisible ? 'Hide List' : 'Show List'}
      </button>
      {listVisible &&
        <div>
          <AddCardForm
            addCard={addCard} />
          <CardsList
            cards={cards}
            deleteCard={deleteCard}
            editCard={editCard} />
        </div>}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
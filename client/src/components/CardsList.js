import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addCard, editCard, deleteCard } from '../redux/actions'

function CardsList({ cards, addCard, editCard, deleteCard }) {
  const [addingCard, setAddingCard] = useState(false)
  const [listVisible, setListVisible] = useState(true)

  return (
    <div className='cards-list'>
      <button className='show-hide-button' onClick={() => setListVisible(!listVisible)}>
        {listVisible ? 'Hide List' : 'Show List'}
      </button>

      {listVisible && (
        <>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Front</th>
                <th>Back</th>
              </tr>
            </thead>

            <tbody>
              {cards.map((card) => (
                <CardsListRow
                  card={card}
                  editCard={editCard}
                  deleteCard={deleteCard}
                  key={card._id}
                />
              ))}
            </tbody>
          </table>
          {addingCard ? (
            <AddCardForm
              addCard={(front, back) => {
                addCard(front, back)
                setAddingCard(false)
              }}
            />
          ) : (
            <div>
              <button onClick={() => setAddingCard(true)}>New Card</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function CardsListRow({ card, editCard, deleteCard }) {
  const [editable, setEditable] = useState(false)

  const row = editable ? (
    <EditableCardListRow
      card={card}
      editCard={editCard}
      deleteCard={(_id) => {
        deleteCard(_id)
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
          onChange={(e) => editCard(card._id, { enabled: e.target.checked })}
        />
      </td>
      {row}
    </tr>
  )
}

function EditableCardListRow({ card, editCard, deleteCard, setUneditable }) {
  const [fields, setFields] = useState({ front: card.front, back: card.back })

  const onChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  return (
    <>
      <td>
        <input type='text' name='front' value={fields.front} onChange={onChange} />
      </td>
      <td>
        <input type='text' name='back' value={fields.back} onChange={onChange} />
      </td>
      <td>
        <button
          onClick={() => {
            editCard(card._id, { ...fields })
            setUneditable()
          }}
        >
          Save
        </button>
      </td>
      <td>
        <button onClick={() => deleteCard(card._id)}>Delete</button>
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

function AddCardForm({ addCard }) {
  const [fields, setFields] = useState({ front: '', back: '' })

  const onChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    addCard(fields.front, fields.back)
    setFields({ front: '', back: '' })
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type='text'
        name='front'
        placeholder='Front'
        value={fields.front}
        onChange={onChange}
      />
      <input type='text' name='back' placeholder='Back' value={fields.back} onChange={onChange} />
      <input type='submit' value='Add Card' />
    </form>
  )
}

const stateToProps = (state) => ({
  cards: state.cards
})

export default connect(stateToProps, { addCard, editCard, deleteCard })(CardsList)

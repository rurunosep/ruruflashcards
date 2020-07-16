import React, { useState } from 'react'

function CardsList({ cards, addCard, editCard, deleteCard, setAllCardsEnabled, swapAllFields }) {
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
          <div className='list-controls'>
            <button onClick={() => setAllCardsEnabled(true)}>Enable All</button>
            <button onClick={() => setAllCardsEnabled(false)}>Disable All</button>
            <button onClick={swapAllFields}>Swap Fields</button>
          </div>
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

export default CardsList

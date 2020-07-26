import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { editCard, deleteCard, setEditCardModalOpen } from '../redux/actions'

function EditCardModal({ card, isOpen, setOpen, editCard, deleteCard }) {
  const [fields, setFields] = useState({ front: '', back: '' })

  useEffect(() => {
    if (card) {
      setFields({ front: card.front, back: card.back })
    }
  }, [card])

  const onChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    editCard(card._id, fields)
    setFields({ front: '', back: '' })
    setOpen(false)
  }

  return (
    <>
      <input
        className='modal-state'
        id='edit-card-modal'
        type='checkbox'
        checked={isOpen}
        onChange={(e) => setOpen(e.target.checked)}
      />
      <div className='modal'>
        <label className='modal-bg' htmlFor='edit-card-modal'></label>
        <div className='modal-body'>
          <h4 className='modal-title'>Edit Card</h4>
          <label className='btn-close' htmlFor='edit-card-modal'>
            X
          </label>
          <form id='edit-card-form' onSubmit={onSubmit}>
            <div className='form-group'>
              <input
                type='text'
                name='front'
                placeholder='Front'
                value={fields.front}
                onChange={onChange}
              />
            </div>
            <div className='form-group'>
              <input
                type='text'
                name='back'
                placeholder='Back'
                value={fields.back}
                onChange={onChange}
              />
            </div>
            <div className='row flex-edges margin-none'>
              <button className='btn-small border-danger' onClick={() => deleteCard(card._id)}>
                <i className='flaticon-trash-can-hand-drawn-symbol text-danger'></i>
              </button>
              <button className='btn-small' type='submit' form='edit-card-form'>
                <i className='flaticon-checkmark-hand-drawn-outline'></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

const stateToProps = (state) => ({
  card: state.cards.filter((card) => card._id === state.editCardId)[0],
  isOpen: state.editCardModalOpen
})

export default connect(stateToProps, { editCard, deleteCard, setOpen: setEditCardModalOpen })(
  EditCardModal
)

import { useState, useEffect, useContext } from 'react';
import { ModalContext } from '../context';

interface EditCardModalProps {
  editCard: (
    _id: string,
    changes: {
      front?: string | undefined;
      back?: string | undefined;
    },
  ) => void;
  deleteCard: (_id: string) => void;
}

export default function EditCardModal({ editCard, deleteCard }: EditCardModalProps) {
  const {
    editCardModalOpen: isOpen,
    setEditCardModalOpen: setOpen,
    cardToEdit: card,
  } = useContext(ModalContext);
  const [fields, setFields] = useState({ front: '', back: '' });

  // Prefill fields with the card being edited
  useEffect(() => {
    if (card) {
      setFields({ front: card.front, back: card.back });
    }
  }, [card]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (card) {
      editCard(card._id, fields);
    }
    setFields({ front: '', back: '' });
    setOpen(false);
  }

  return (
    <>
      <input
        className="modal-state"
        id="edit-card-modal"
        type="checkbox"
        checked={isOpen}
        onChange={(e) => setOpen(e.target.checked)}
      />
      <div className="modal">
        <label className="modal-bg" htmlFor="edit-card-modal" />
        <div className="modal-body">
          <h4 className="modal-title">Edit Card</h4>
          <label className="btn-close" htmlFor="edit-card-modal">
            X
          </label>
          <form id="edit-card-form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="front"
                placeholder="Front"
                value={fields.front}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="back"
                placeholder="Back"
                value={fields.back}
                onChange={onChange}
              />
            </div>
            <div className="row flex-edges margin-none">
              <button
                className="btn-small border-danger"
                type="button"
                onClick={() => {
                  if (card) {
                    deleteCard(card._id);
                  }
                  setOpen(false);
                }}
              >
                <i className="flaticon-trash-can-hand-drawn-symbol text-danger" />
              </button>
              <button className="btn-small" type="submit" form="edit-card-form">
                <i className="flaticon-checkmark-hand-drawn-outline" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

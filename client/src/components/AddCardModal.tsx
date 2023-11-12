import { useState, useContext } from 'react';
import { ModalContext } from '../context';

interface AddCardModalProps {
  addCard: (front: string, back: string) => void;
}

export default function AddCardModal({ addCard }: AddCardModalProps) {
  const { addCardModalOpen: isOpen, setAddCardModalOpen: setOpen } = useContext(ModalContext);
  const [fields, setFields] = useState({ front: '', back: '' });

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addCard(fields.front, fields.back);
    setFields({ front: '', back: '' });
    setOpen(false);
  }

  return (
    <>
      <input
        className="modal-state"
        id="add-card-modal"
        type="checkbox"
        checked={isOpen}
        onChange={(e) => setOpen(e.target.checked)}
      />
      <div className="modal">
        <label className="modal-bg" htmlFor="add-card-modal" />
        <div className="modal-body">
          <h4 className="modal-title">Add Card</h4>
          <label className="btn-close" htmlFor="add-card-modal">
            X
          </label>
          <form onSubmit={onSubmit}>
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
            <div className="row flex-right margin-none">
              <button className="btn-small" type="submit">
                <i className="flaticon-checkmark-hand-drawn-outline" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

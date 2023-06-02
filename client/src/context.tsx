import React from 'react'
import type { Card } from './components/App'

interface ModalContextType {
	addCardModalOpen: boolean
	setAddCardModalOpen: (open: boolean) => void
	editCardModalOpen: boolean
	setEditCardModalOpen: (open: boolean) => void
	cardToEdit: Card | null
	setCardToEdit: (card: Card | null) => void
	registerModalOpen: boolean
	setRegisterModalOpen: (open: boolean) => void
}

export const ModalContext = React.createContext({} as ModalContextType)

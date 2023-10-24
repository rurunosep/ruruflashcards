import React, { useState } from 'react'
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

export function ModalContextProvider({ children }: { children: React.ReactNode }) {
	const [addCardModalOpen, setAddCardModalOpen] = useState(false)
	const [editCardModalOpen, setEditCardModalOpen] = useState(false)
	const [cardToEdit, setCardToEdit] = useState<Card | null>(null)
	const [registerModalOpen, setRegisterModalOpen] = useState(false)

	return (
		<ModalContext.Provider
			value={{
				addCardModalOpen,
				setAddCardModalOpen,
				editCardModalOpen,
				setEditCardModalOpen,
				cardToEdit,
				setCardToEdit,
				registerModalOpen,
				setRegisterModalOpen,
			}}
		>
			{children}
		</ModalContext.Provider>
	)
}

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { loadCards, getUser } from '../redux/actions'
import Navbar from './Navbar'
import ErrorAlert from './ErrorAlert'
import Quiz from './Quiz'
import Options from './Options'
import CardsList from './CardsList'
import Footer from './Footer'
import RegisterModal from './RegisterModal'
import AddCardModal from './AddCardModal'
import EditCardModal from './EditCardModal'

function App({ getUser, loadCards }) {
  useEffect(() => {
    getUser()
    loadCards()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <Navbar />
      <ErrorAlert />
      <div className='row flex-center margin-none'>
        <div className='sm-col margin-small' style={{ width: '25rem' }}>
          <Quiz />
          <Options />
        </div>
        <div className='sm-col margin-small' style={{ width: '25rem' }}>
          <CardsList />
        </div>
      </div>
      <Footer />
      <RegisterModal />
      <AddCardModal />
      <EditCardModal />
    </>
  )
}

export default connect(null, { getUser, loadCards })(App)

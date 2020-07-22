import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { loadCards, getUser } from '../redux/actions'
import LoginLogoutRegister from './LoginLogoutRegister'
import CardsList from './CardsList'
import Quiz from './Quiz'

function App({ loadCards, getUser }) {
  // Get authenticated user of current session and load their cards
  useEffect(() => {
    loadCards()
    getUser()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <LoginLogoutRegister />
      <div className='app'>
        <Quiz />
        <CardsList />
      </div>
    </>
  )
}

export default connect(null, { loadCards, getUser })(App)

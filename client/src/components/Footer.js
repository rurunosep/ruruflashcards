import React from 'react'

function Footer() {
  return (
    <footer className='border'>
      <div className='row flex-edges margin-small'>
        <div>
          <a href='https://github.com/rurunosep/ruruflashcards' target='_blank'>
            <i className='flaticon-octocat-hand-drawn-logo-outline'></i>
            github.com/rurunosep/ruruflashcards
          </a>
        </div>
        <div>
          Icons made by{' '}
          <a href='https://www.flaticon.com/authors/freepik' title='Freepik' target='_blank'>
            Freepik
          </a>{' '}
          from{' '}
          <a href='https://www.flaticon.com/' title='Flaticon' target='_blank'>
            www.flaticon.com
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

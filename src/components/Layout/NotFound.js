import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './layout.css'
import { ThemeContext } from '../../state/ThemeContext'

const NotFound = () => {
  const { isDarkMode } = useContext(ThemeContext)

  return (
    <div className="containr">
      <div className={isDarkMode ? 'not-found-dark-mode' : 'not-found'}>
        <div className="content-404">
          <h1
            className={`${
              isDarkMode ? 'title-404-dark-mode' : 'title-404'
            } bold text-center`}
          >
            Oops!
          </h1>
          <p
            className={`desc-404 ${
              isDarkMode ? 'text-muted-dark-mode' : 'text-muted'
            } text-center`}
          >
            We couldn't find the page...
          </p>

          <button
            style={{ fontSize: '1.125rem', height: '50px' }}
            className="btn regular-btn bigger-btn border-rad-05 btn-404 ml-4"
            type="button"
          >
            <Link to="/" style={{ color: '#fff', fontWeight: 'bold' }}>
              Back to Avix Vaults
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound

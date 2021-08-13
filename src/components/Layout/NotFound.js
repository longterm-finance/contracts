import React from 'react'
import { Link } from 'react-router-dom'
import './layout.css'

const NotFound = ({ isDarkMode }) => {
  return (
    <div className="container">
      <div className="not-found">
        <div className="content-404">
          <h1 className="title-404 bold text-center">Oops!</h1>
          <p
            className={`desc-404 ${
              isDarkMode ? 'text-muted-dark-mode' : 'text-muted'
            } text-center`}
          >
            We couldn't find the page...
          </p>

          <button className="btn shadow-btn btn-404 ml-2">
            <Link to="/" style={{ color: '#fff', fontWeight: 'bold' }}>
              Back to Avix Vault
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound

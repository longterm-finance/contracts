import React, { useContext } from 'react'
import './layout.css'
import spinner from '../../assets/other/spinner.gif'
import { ThemeContext } from '../../state/ThemeContext'

const Spinner = () => {
  const { isDarkMode } = useContext(ThemeContext)

  return (
    <div className={isDarkMode && 'dark-mode-spinner'}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <img src={spinner} alt="Loading..." className="spinner" />
      <div className="loading">Loading...</div>
    </div>
  )
}

export default Spinner

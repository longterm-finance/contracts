import React from 'react'
import './layout.css'
import spinner from '../../assets/other/spinner.gif'

const Spinner = () => {
  return (
    <React.Fragment>
      <img src={spinner} alt="Loading..." className="spinner" />
    </React.Fragment>
  )
}

export default Spinner

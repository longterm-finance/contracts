import React from 'react'
import './layout.css'
import { useMediaQuery } from 'react-responsive'
import errorImg from '../../assets/images/error-img.png'

const ErrorPage = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 900px)' })

  return (
    <React.Fragment>
      <div style={{ height: '100px' }} />
      <section
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginTop: '30px',
        }}
      >
        <h1
          className="x-large not-found-title bold"
          title="Page Not Found"
          style={{ textAlign: 'center' }}
        >
          <i
            className="fas fa-exclamation-triangle"
            style={{ color: '#e84142' }}
          />{' '}
          Sorry, This Page is Broken!
        </h1>
        <p
          className="come-back-later mt-2 ml-2"
          style={{ textAlign: 'center' }}
        >
          We are working hard to solve this problem ASAP!
        </p>
        <img
          className="img-not-found"
          src={errorImg}
          alt="Page Not Found"
          title="Page Not Found"
          style={{
            display: 'inline-block',
            backfroundSize: 'cover',
            backgroundPosition: 'center',
            width: isMobile ? '400px' : '700px',
            height: isMobile ? '50vh' : '60vh',
          }}
        />
      </section>
    </React.Fragment>
  )
}

export default ErrorPage

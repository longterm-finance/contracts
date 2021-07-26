import React from 'react'
import ErrorPage from './ErrorPage'
import './layout.css'

class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError(error) {
    console.error(`ErrorBoundary has catched an error: ${error}`)
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      `ErrorBoundary has catched an error: ${error}; Error info: ${errorInfo}`,
    )
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />
    }

    return this.props.children
  }
}

export default ErrorBoundary

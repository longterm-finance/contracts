import React, { lazy, Suspense, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import Spinner from './components/Layout/Spinner'
import ErrorBoundary from './components/Layout/ErrorBoundary'
import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const DashboardLayout = lazy(() =>
  import('./components/Dashboard/DashboardLayout'),
)
const Vault = lazy(() => import('./components/Vault/Vault'))
const Trade = lazy(() => import('./components/Trade/Trade'))
const Pool = lazy(() => import('./components/Pool/Pool'))
const Farm = lazy(() => import('./components/Farm/Farm'))
const Learn = lazy(() => import('./components/Learn/Learn'))
const NotFoundImported = lazy(() => import('./components/Layout/NotFound'))

const App = () => {
  const [darkMode, setDarkMode] = useState(false)

  const NotFound = () => (
    <NotFoundImported isDarkMode={darkMode ? true : false} />
  )

  return (
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <DashboardLayout
              switchMode={() => setDarkMode(!darkMode)}
              isDarkMode={darkMode ? true : false}
            />
            <Switch>
              <Route exact path="/" component={Vault} />
              <Route exact path="/trade" component={Trade} />
              <Route exact path="/pool" component={Pool} />
              <Route exact path="/farm" component={Farm} />
              <Route exact path="/learn" component={Learn} />
              <Route component={NotFound} />
            </Switch>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Suspense>
        </ErrorBoundary>
      </Router>
    </Provider>
  )
}

export default App

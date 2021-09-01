import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Spinner from './components/Layout/Spinner'
import ErrorBoundary from './components/Layout/ErrorBoundary'
import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'semantic-ui-css/semantic.min.css'
import {
  AVAXVault,
  WETHVault,
  WBTCVault,
  DAIVault,
  USDTVault,
} from './components/Vault/Vault'
import ThemeProvider from './state/ThemeContext'

const DashboardLayout = lazy(() =>
  import('./components/Dashboard/DashboardLayout'),
)
const Trade = lazy(() => import('./components/Trade/Trade'))
const Pool = lazy(() => import('./components/Pool/Pool'))
const Farm = lazy(() => import('./components/Farm/Farm'))
const NFT = lazy(() => import('./components/NFT/NFT'))
const Learn = lazy(() => import('./components/Learn/Learn'))
const NotFound = lazy(() => import('./components/Layout/NotFound'))

const App = () => {
  const Toastify = () => (
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
  )

  return (
    <ThemeProvider>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <DashboardLayout />
            <Switch>
              <Route exact path="/" component={AVAXVault} />
              <Route exact path="/WETH" component={WETHVault} />
              <Route exact path="/WBTC" component={WBTCVault} />
              <Route exact path="/DAI" component={DAIVault} />
              <Route exact path="/USDT" component={USDTVault} />
              <Route exact path="/trade" component={Trade} />
              <Route exact path="/pool" component={Pool} />
              <Route exact path="/farm" component={Farm} />
              <Route exact path="/nft" component={NFT} />
              <Route exact path="/learn" component={Learn} />
              <Route component={NotFound} />
            </Switch>
            <Toastify />
          </Suspense>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  )
}

export default App

import React, { lazy, Suspense, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import SpinnerImported from './components/Layout/Spinner'
import ErrorBoundary from './components/Layout/ErrorBoundary'
import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'
import 'semantic-ui-css/semantic.min.css'
import {
  WETHVault,
  MATICVault,
  DAIVault,
  USDCVault,
  WBTCVault,
} from './components/Vault/Vault'

function getLibrary(provider) {
  return new Web3(provider)
}

const DashboardLayout = lazy(() =>
  import('./components/Dashboard/DashboardLayout'),
)
const TradeImported = lazy(() => import('./components/Trade/Trade'))
const PoolImported = lazy(() => import('./components/Pool/Pool'))
const FarmImported = lazy(() => import('./components/Farm/Farm'))
const LearnImported = lazy(() => import('./components/Learn/Learn'))
const NFTImported = lazy(() => import('./components/NFT/NFT'))
const NotFoundImported = lazy(() => import('./components/Layout/NotFound'))

const App = () => {
  const [darkMode, setDarkMode] = useState(false)

  const WETH = () => <WETHVault isDarkMode={darkMode ? true : false} />
  const MATIC = () => <MATICVault isDarkMode={darkMode ? true : false} />
  const DAI = () => <DAIVault isDarkMode={darkMode ? true : false} />
  const USDC = () => <USDCVault isDarkMode={darkMode ? true : false} />
  const WBTC = () => <WBTCVault isDarkMode={darkMode ? true : false} />
  const Trade = () => <TradeImported isDarkMode={darkMode ? true : false} />
  const Pool = () => <PoolImported isDarkMode={darkMode ? true : false} />
  const Farm = () => <FarmImported isDarkMode={darkMode ? true : false} />
  const NFT = () => <NFTImported isDarkMode={darkMode ? true : false} />
  const Learn = () => <LearnImported isDarkMode={darkMode ? true : false} />
  const NotFound = () => (
    <NotFoundImported isDarkMode={darkMode ? true : false} />
  )
  const Spinner = () => <SpinnerImported isDarkMode={darkMode ? true : false} />

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <DashboardLayout
              switchMode={() => setDarkMode(!darkMode)}
              isDarkMode={darkMode ? true : false}
            />
            <Switch>
              <Route exact path="/" component={WETH} />
              <Route exact path="/MATIC" component={MATIC} />
              <Route exact path="/DAI" component={DAI} />
              <Route exact path="/USDC" component={USDC} />
              <Route exact path="/WBTC" component={WBTC} />
              <Route exact path="/trade" component={Trade} />
              <Route exact path="/pool" component={Pool} />
              <Route exact path="/farm" component={Farm} />
              <Route exact path="/nft" component={NFT} />
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
    </Web3ReactProvider>
  )
}

export default App

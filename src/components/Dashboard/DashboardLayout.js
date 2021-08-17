import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import './dashboard.css'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import Button from '@material-ui/core/Button'
import transparentPNGLogo from '../../assets/images/logo_transparent_bg.png'
import vaultIcon from '../../assets/images/vault.svg'
import whiteVaultIcon from '../../assets/images/vault_white.svg'
import greyVaultIcon from '../../assets/images/vault_grey.svg'
import { useWeb3React } from '@web3-react/core'
import { Modal } from 'semantic-ui-react'
import { InjectedConnector } from '@web3-react/injected-connector'

const injected = new InjectedConnector({
  supportedChainIds: [137], // 137 = Matic mainnet; later add 1 (Ethereum mainnet)
})

const DashboardLayout = ({ switchMode, isDarkMode }) => {
  const { active, account, activate, deactivate, chainId } = useWeb3React()

  async function connectWallet() {
    try {
      await activate(injected)
    } catch (error) {
      console.error(error)
    }
  }

  async function disconnectWallet() {
    try {
      await deactivate()
    } catch (error) {
      console.error(error)
    }
  }

  const [toggleAccountModal, setToggleAccountModal] = useState(false)
  const [mouseOverCopy, setMouseOverCopy] = useState()
  const [copyAddressClicked, setCopyAddressClicked] = useState(false)

  const openAccountModal = () => setToggleAccountModal(true)
  const closeAccountModal = () => setToggleAccountModal(false)

  const onMouseOver = () => setMouseOverCopy(true)
  const onMouseOut = () => setMouseOverCopy(false)

  const copyAddress = () => {
    const el = document.createElement('input')
    el.value = account
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }

  const onCopyAddressClicked = () => {
    setCopyAddressClicked(true)
    setTimeout(() => setCopyAddressClicked(false), 2000)
  }

  const mobileHeader = useMediaQuery({ query: '(max-width: 992px)' })

  const Navbar = () => {
    const MoonIcon = () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={isDarkMode ? 'none' : '#000'}
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )
    }

    const SunIcon = () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      )
    }

    const ModeSwitcher = () => {
      return (
        <span className={!mobileHeader && 'ml-2 mr-3'}>
          <button
            type="button"
            onClick={switchMode}
            className={`mode-switcher ${!isDarkMode && 'mode-switcher-moon'} ${
              mobileHeader && 'ml-3'
            }`}
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </span>
      )
    }

    const useStyles = makeStyles({
      list: {
        width: 250,
      },
      fullList: {
        width: 'auto',
      },
    })

    function SwipeableTemporaryDrawer() {
      const classes = useStyles()
      const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
      })

      const toggleDrawer = (anchor, open) => (event) => {
        if (
          event &&
          event.type === 'keydown' &&
          (event.key === 'Tab' || event.key === 'Shift')
        ) {
          return
        }

        setState({ ...state, [anchor]: open })
      }

      const list = (anchor) => (
        <div
          className={clsx(classes.list, {
            [classes.fullList]: anchor === 'top' || anchor === 'bottom',
          })}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
          style={{
            backgroundColor: isDarkMode && '#191b1f',
            paddingBottom: isDarkMode && mobileHeader && '250vw',
          }}
        >
          <List className="mobile-menu">
            <Link
              to="/"
              className={`nav-link ${isDarkMode && 'nav-link-dark-mode'}`}
            >
              <img
                src={isDarkMode ? whiteVaultIcon : vaultIcon}
                alt="Vault"
                className="vault-mobile"
                style={{
                  height: 18,
                  width: 23,
                }}
              />
              <span className="mobile-menu-tab-name">Vault</span>
            </Link>
            <Link
              to="/trade"
              className={`nav-link ${isDarkMode && 'nav-link-dark-mode'}`}
            >
              <i className="fas fa-sync-alt" />{' '}
              <span className="mobile-menu-tab-name">Trade</span>
            </Link>
            <Link
              to="/pool"
              className={`nav-link ${isDarkMode && 'nav-link-dark-mode'}`}
            >
              <i className="fas fa-swimming-pool" />{' '}
              <span className="mobile-menu-tab-name">Pool</span>
            </Link>
            <Link
              to="/farm"
              className={`nav-link ${isDarkMode && 'nav-link-dark-mode'}`}
            >
              <i className="fas fa-tractor" />{' '}
              <span className="mobile-menu-tab-name">Farm</span>
            </Link>
            <Link
              to="/nft"
              className={`nav-link ${isDarkMode && 'nav-link-dark-mode'}`}
            >
              <i className="fas fa-shapes" />{' '}
              <span className="mobile-menu-tab-name">Collectibles</span>
            </Link>
            {/*  eslint-disable-next-line */}
            <a
              // ADD LATER: target="_blank"
              // REPLACE LATER: https://gov.avix.finance
              rel="noreferrer"
              // eslint-disable-next-line
              href="javascript:void(0)"
              className={`nav-link ${
                isDarkMode && 'nav-link-dark-mode'
              } disabled-link`}
            >
              {/* REMOVE THE "disabled-link" CLASSNAME LATER */}
              <i className="fas fa-bullhorn" />{' '}
              <span className="mobile-menu-tab-name">
                {/* REPLACE LATER: Governance */}
                Vote (SOON)
              </span>
            </a>
            {/*  eslint-disable-next-line */}
            <a
              // ADD LATER: target="_blank"
              // REPLACE LATER: https://stats.avix.finance
              rel="noreferrer"
              // eslint-disable-next-line
              href="javascript:void(0)"
              className={`nav-link ${
                isDarkMode && 'nav-link-dark-mode'
              } disabled-link`}
            >
              {/* REMOVE THE "disabled-link" CLASSNAME LATER */}
              <i className="fas fa-chart-line" />{' '}
              <span className="mobile-menu-tab-name">
                {/* REPLACE LATER: Stats */}
                Stats (SOON)
              </span>
            </a>
            <Link
              to="/learn"
              className={`nav-link ${isDarkMode && 'nav-link-dark-mode'}`}
            >
              <i className="fas fa-book-open" />{' '}
              <span className="mobile-menu-tab-name">Learn</span>
            </Link>
          </List>
          <ModeSwitcher />
          {
            <List className="mobile-menu">
              <button
                className="btn regular-btn mt-3 bold"
                type="button"
                style={{
                  marginLeft: '22px',
                  fontWeight: 'bold',
                  height: '50px',
                  fontSize: '1.125em',
                }}
              >
                Connect Wallet
              </button>
            </List>
          }
        </div>
      )

      const styles = {
        largeIcon: {
          width: 35,
          height: 35,
          position: 'relative',
          bottom: 3,
        },
      }

      return (
        <div>
          {['right'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button
                style={{ backgroundColor: isDarkMode ? '#191b1f' : '#fafbfd' }}
                onClick={toggleDrawer(anchor, true)}
              >
                <MenuIcon style={styles.largeIcon} className="menu-icon" />
              </Button>
              <SwipeableDrawer
                anchor={'right'}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
              >
                {list(anchor)}
              </SwipeableDrawer>
            </React.Fragment>
          ))}
        </div>
      )
    }

    return (
      <nav className={`navbar ${isDarkMode && 'navbar-dark-mode'}`}>
        {!mobileHeader ? (
          <React.Fragment>
            <div className="logo">
              <Link to="/">
                <img
                  className="logo-img"
                  src={transparentPNGLogo}
                  alt="Avix Logo"
                />
              </Link>
            </div>
            <div className="nav-links">
              <ModeSwitcher />
              <button
                className="btn regular-btn mr-4"
                type="button"
                style={{
                  fontWeight: 'bold',
                  height: '50px',
                  fontSize: '1.125em',
                }}
                onClick={() => {
                  if (!active) {
                    connectWallet()
                  }

                  if ((chainId && chainId !== 137) || !active) {
                    alert('Please switch to Matic!')
                  }

                  openAccountModal()
                }}
              >
                {active
                  ? account !== undefined && (
                      <React.Fragment>
                        <span className="coin-balance-header mr-3">
                          14.579 MATIC
                        </span>{' '}
                        {account[0] +
                          account[1] +
                          account[2] +
                          account[3] +
                          '...' +
                          account[account.length - 4] +
                          account[account.length - 3] +
                          account[account.length - 2] +
                          account[account.length - 1]}
                      </React.Fragment>
                    )
                  : 'Connect Wallet'}
              </button>
            </div>

            <Modal
              size="mini"
              open={toggleAccountModal}
              onClose={closeAccountModal}
            >
              <Modal.Header
                className="text-center bold"
                style={{ fontSize: '1.75em' }}
              >
                Account
              </Modal.Header>
              <Modal.Content
                className="text-center bold"
                style={{ fontSize: '1.15em' }}
              >
                {active && (
                  <React.Fragment>
                    <i
                      class="far fa-check-circle"
                      style={{
                        color: 'green',
                      }}
                    />{' '}
                    Connected with MetaMask
                  </React.Fragment>
                )}
              </Modal.Content>
              <div className="copy-address-btn-container">
                <button
                  className="btn btn-link light-btn border-rad-05 dark-text"
                  type="button"
                  style={{
                    fontWeight: 'bold',
                    border: '1.5px solid #e84142',
                  }}
                  onClick={() => {
                    copyAddress()
                    onCopyAddressClicked()
                  }}
                  onMouseOver={onMouseOver}
                  onMouseOut={onMouseOut}
                >
                  {account !== undefined &&
                    account[0] +
                      account[1] +
                      account[2] +
                      account[3] +
                      '...' +
                      account[account.length - 4] +
                      account[account.length - 3] +
                      account[account.length - 2] +
                      account[account.length - 1]}{' '}
                  {mouseOverCopy && <i className="ml-2 far fa-copy" />}
                </button>
                {copyAddressClicked && (
                  <span className="bold ml-3">
                    <i
                      class="far fa-check-circle"
                      style={{
                        color: 'green',
                      }}
                    />{' '}
                    Address Copied!
                  </span>
                )}
              </div>
              <div className="account-options">
                <button
                  className="btn light-btn mt-3 mb-4 mr-3 border-rad-05 dark-text"
                  type="button"
                  style={{
                    fontWeight: 'bold',
                    border: '1.5px solid #e84142',
                  }}
                >
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://polygonscan.com/address/${account}`}
                    className="bold"
                    style={{ color: '#000' }}
                  >
                    View on Polygonscan
                  </a>
                </button>

                <button
                  className="btn light-btn mt-3 mb-4 border-rad-05 dark-text"
                  type="button"
                  style={{
                    fontWeight: 'bold',
                    border: '1.5px solid #e84142',
                  }}
                  onClick={() => {
                    disconnectWallet()
                    closeAccountModal()
                  }}
                >
                  Disconnect
                </button>
              </div>
            </Modal>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div
              className="logo"
              style={{
                position: 'relative',
                right: 25,
              }}
            >
              <Link to="/">
                <img
                  className="logo-img logo-img-header"
                  src={transparentPNGLogo}
                  alt="Avix Logo"
                  style={{
                    margin: 'auto',
                    position: 'relative',
                    right: '20',
                  }}
                />
              </Link>
            </div>
            <SwipeableTemporaryDrawer />
          </React.Fragment>
        )}
      </nav>
    )
  }

  class SidebarItem extends React.Component {
    handleClick = () => {
      const { path, onItemClick } = this.props
      onItemClick(path)
    }

    render() {
      const { active } = this.props
      return (
        <React.Fragment>
          {this.props.path[0] === '/' ? (
            <Link
              active={active}
              className={`pt-4 ${
                active ? 'sidebar-item-active' : 'sidebar-item'
              } ${this.props.css}`}
              to={this.props.path}
              onClick={this.handleClick}
              style={{ color: active ? '#fff' : '#b8b4b4' }}
            >
              {this.props.path === '/' && (
                <img
                  src={active ? whiteVaultIcon : greyVaultIcon}
                  alt="Vault"
                  className="vault"
                  style={{
                    width: 22.5,
                    height: 22.5,
                  }}
                />
              )}
              <span
                className="sidebar-tab-name"
                style={{
                  position: this.props.path === '/' && 'relative',
                  top: this.props.path === '/' && '1.5px',
                }}
              >
                {this.props.name}
              </span>
            </Link>
          ) : (
            <a
              // ADD LATER: target="_blank"
              rel="noreferrer"
              href={this.props.path}
              active={active}
              className={`pt-4 ${
                active ? 'sidebar-item-active' : 'sidebar-item'
              } ${this.props.css}
                disabled-link
              `} // REMOVE THE "disabled-link" CLASSNAME LATER
              onClick={this.handleClick}
              style={{ color: active ? '#fff' : '#b8b4b4' }}
            >
              <span className="sidebar-tab-name">{this.props.name}</span>
            </a>
          )}
        </React.Fragment>
      )
    }
  }

  class Sidebar extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        activePath: props.location.pathname,
        items: [
          {
            path: '/',
            name: 'Vaults',
            css: 'fas vault',
            key: Math.random(),
          },
          {
            path: '/trade',
            name: 'Trade',
            css: 'fas fa-sync-alt',
            key: Math.random() + 1,
          },
          {
            path: '/pool',
            name: 'Pool',
            css: 'fas fa-swimming-pool',
            key: Math.random() + 2,
          },
          {
            path: '/farm',
            name: 'Farm',
            css: 'fas fa-tractor',
            key: Math.random() + 3,
          },
          {
            path: '/nft',
            name: 'Collectibles',
            css: 'fas fa-shapes',
            key: Math.random() + 4,
          },
          {
            // eslint-disable-next-line
            path: 'javascript:void(0)', // REPLACE LATER: https://gov.avix.finance
            name: 'Vote (SOON)', // REPLACE LATER: Governance
            css: 'fas fa-bullhorn',
            key: Math.random() + 5,
          },
          {
            // eslint-disable-next-line
            path: 'javascript:void(0 + 0)', // REPLACE LATER: https://stats.avix.finance
            name: 'Stats (SOON)', // REPLACE LATER: Stats
            css: 'fas fa-chart-line',
            key: Math.random() + 6,
          },
          {
            path: '/learn',
            name: 'Learn',
            css: 'fas fa-book-open',
            key: Math.random() + 7,
          },
        ],
      }
    }

    onItemClick = (path) => {
      this.setState({ activePath: path })
    }

    render() {
      const { items, activePath } = this.state
      return (
        <div className={isDarkMode ? 'sidebar sidebar-dark-mode' : 'sidebar'}>
          {items.map((item) => {
            return (
              <SidebarItem
                path={item.path}
                name={item.name}
                css={item.css}
                onItemClick={this.onItemClick}
                active={item.path === activePath}
                key={item.key}
              />
            )
          })}
        </div>
      )
    }
  }

  const RouterSidebar = withRouter(Sidebar)

  return (
    <div className="dashboard-layout">
      <Navbar />
      {!mobileHeader && <RouterSidebar />}
    </div>
  )
}

export default DashboardLayout

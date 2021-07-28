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

const DashboardLayout = ({ switchMode, isDarkMode }) => {
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
              <i className="fas fa-home" />{' '}
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
            <a
              target="_blank"
              rel="noreferrer"
              href="https://gov.avix.finance"
              className={`nav-link ${isDarkMode && 'nav-link-dark-mode'}`}
            >
              <i className="fas fa-bullhorn" />{' '}
              <span className="mobile-menu-tab-name">Governance</span>
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://stats.avix.finance"
              className={`nav-link ${isDarkMode && 'nav-link-dark-mode'}`}
            >
              <i className="fas fa-chart-line" />{' '}
              <span className="mobile-menu-tab-name">Stats</span>
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
                className="btn shadow-btn mt-2 bold"
                type="button"
                style={{ marginLeft: '22px', fontWeight: 'bold' }}
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
                className="btn shadow-btn mr-4"
                type="button"
                style={{ fontWeight: 'bold' }}
              >
                Connect Wallet
              </button>
            </div>
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
              className={`pt-3 ${
                active ? 'sidebar-item-active' : 'sidebar-item'
              } ${this.props.css}`}
              to={this.props.path}
              onClick={this.handleClick}
              style={{ color: active ? '#fff' : '#b8b4b4' }}
            >
              <span className="sidebar-tab-name">{this.props.name}</span>
            </Link>
          ) : (
            <a
              target="_blank"
              rel="noreferrer"
              href={this.props.path}
              active={active}
              className={`pt-3 ${
                active ? 'sidebar-item-active' : 'sidebar-item'
              } ${this.props.css}`}
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
            name: 'Vault',
            css: 'fa fa-fw fa-home',
            key: 1,
          },
          {
            path: '/trade',
            name: 'Trade',
            css: 'fas fa-sync-alt',
            key: 2,
          },
          {
            path: '/pool',
            name: 'Pool',
            css: 'fas fa-swimming-pool',
            key: 3,
          },
          {
            path: '/farm',
            name: 'Farm',
            css: 'fas fa-tractor',
            key: 4,
          },
          {
            path: 'https://gov.avix.finance',
            name: 'Governance',
            css: 'fas fa-bullhorn',
            key: 5,
          },
          {
            path: 'https://stats.avix.finance',
            name: 'Stats',
            css: 'fas fa-chart-line',
            key: 6,
          },
          {
            path: '/learn',
            name: 'Learn',
            css: 'fas fa-book-open',
            key: 7,
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
        <div className="sidebar">
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

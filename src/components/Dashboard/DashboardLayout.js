import React from 'react'
import { Link } from 'react-router-dom'
import './dashboard.css'

const DashboardLayout = () => {
  const Navbar = () => {
    return (
      <nav className="navbar">
        <Link to="/" className="navbar-logo-link">
          <span className="avix-logo-navbar">Avix Logo</span>
        </Link>
        <button className="connect-wallet-btn">Connect Wallet</button>
        <input
          type="checkbox"
          name="darkModeToggle"
          value="light"
          className="dark-mode-toggle"
        />
        <span>Dark Mode Toggle</span>
      </nav>
    )
  }

  const Sidebar = () => {
    return (
      <div className="sidebar">
        <span className="sidebar-tab">
          <Link to="/" className="sidebar-tab-link">
            Vault
          </Link>
        </span>
        <span className="sidebar-tab">
          <Link to="/trade" className="sidebar-tab-link">
            Trade
          </Link>
        </span>
        <span className="sidebar-tab">
          <Link to="/pool" className="sidebar-tab-link">
            Pool
          </Link>
        </span>
        <span className="sidebar-tab">
          <a
            href="https://gov.avix.finance"
            target="_blank"
            rel="noreferrer"
            className="sidebar-tab-link"
          >
            Governance
          </a>
        </span>
        <span className="sidebar-tab">
          <a
            href="https://stats.avix.finance"
            target="_blank"
            rel="noreferrer"
            className="sidebar-tab-link"
          >
            Stats
          </a>
        </span>
        <span className="sidebar-tab">
          <Link to="/learn" className="sidebar-tab-link">
            Learn
          </Link>
        </span>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />
    </div>
  )
}

export default DashboardLayout

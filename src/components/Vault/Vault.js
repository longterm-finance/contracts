import React from 'react'
import './vault.css'

class Vault extends React.Component {
  async componentDidMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    console.log('Load blockchain data...')
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { children } = this.props

    return <div className="vault-container">{children}</div>
  }
}

export class WETHVault extends Vault {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { isDarkMode } = this.props

    return (
      <Vault>
        <h1>WETH Vault</h1>
      </Vault>
    )
  }
}

export class MATICVault extends Vault {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { isDarkMode } = this.props

    return (
      <Vault>
        <h1>MATIC Vault</h1>
      </Vault>
    )
  }
}

export class DAIVault extends Vault {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { isDarkMode } = this.props

    return (
      <Vault>
        <h1>DAI Vault</h1>
      </Vault>
    )
  }
}

export class USDCVault extends Vault {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { isDarkMode } = this.props

    return (
      <Vault>
        <h1>USDC Vault</h1>
      </Vault>
    )
  }
}

export class WBTCVault extends Vault {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { isDarkMode } = this.props

    return (
      <Vault>
        <h1>WBTC Vault</h1>
      </Vault>
    )
  }
}

export default Vault

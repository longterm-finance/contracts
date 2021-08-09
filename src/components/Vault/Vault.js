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
    const { isDarkMode } = this.props

    return (
      <div className="vault-container">
        <div className="mint-container">Mint</div>
        <div className="burn-container">Burn</div>
      </div>
    )
  }
}

export default Vault

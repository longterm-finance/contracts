import React from 'react'
import { Link } from 'react-router-dom'
import Web3 from 'web3'
import './vault.css'

class Vault extends React.Component {
  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    console.log('Load blockchain data...')
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
    }
  }

  render() {
    return (
      <div className="vault-container">
        <div className="mint-container">Mint</div>
        <div className="burn-container">Burn</div>
      </div>
    )
  }
}

export default Vault

import React, { useState } from 'react'
import './vault.css'
import dai from '../../assets/images/dai.png'
import wbtc from '../../assets/images/wbtc.png'
import eth from '../../assets/images/eth.png'
import avix from '../../assets/images/favicon.png'
import dvix from '../../assets/images/dVIX_favicon.png'
import usdc from '../../assets/images/usdc.png'
import matic from '../../assets/images/matic.png'

const TabNav = ({ children, tabs, selected, setSelected }) => {
  return (
    <div className="tab-nav">
      <ul className="nav nav-tabs">
        {tabs.map((tab) => {
          const active = tab === selected ? 'active' : ''
          return (
            <li className="nav-item" key={tab}>
              <span
                className={'nav-link ' + active}
                onClick={() => setSelected(tab)}
              >
                {tab}
              </span>
            </li>
          )
        })}
      </ul>
      {children}
    </div>
  )
}

const Tab = ({ isSelected, children }) => {
  if (isSelected) {
    return <div className="tab-container">{children}</div>
  }

  return null
}

const CollateralSelector = ({ selectedColl, setSelectedColl, collOptions }) => {
  return (
    <div className="coll-selector mb-5">
      <select name="" id="" className="form-select">
        {collOptions.map((collOption) => {
          const active = collOption.name === selectedColl ? 'active' : ''
          return (
            <option
              className={active}
              onClick={() => {
                setSelectedColl(collOption.name)
                console.log(collOption.name === 'WBTC' && 'WBTC')
              }}
              value={collOption.name.substr(0)}
              key={collOption.name}
            >
              {/* <img alt={collOption.name} src={dai} width={32} height={32} /> */}
              {collOption.name.substr(0)}
            </option>
          )
        })}
      </select>
    </div>
  )
}

class Vault extends React.Component {
  async componentDidMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    console.log('Load blockchain data...')
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: 'Add / Remove Collateral',
      selectedColl: 'WETH',
    }
  }

  setSelected = (tab) => {
    this.setState({ selected: tab })
  }

  setSelectedColl = (collOption) => {
    this.setState({ selectedColl: collOption })
  }

  render() {
    const { children } = this.props
    const { selected, selectedColl } = this.state

    return (
      <div className="vault-container">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <h1 className="text-center">Avix Vault</h1>

        <div className="select-coll-container">
          <h3 className="text-left">Select Collateral:</h3>
          <CollateralSelector
            collOptions={[
              {
                name: 'WETH',
                src: eth,
              },
              {
                name: 'MATIC',
                src: matic,
              },
              {
                name: 'DAI',
                src: dai,
              },
              {
                name: 'USDC',
                src: usdc,
              },
              {
                name: 'WBTC',
                src: wbtc,
              },
            ]}
            selectedColl={selectedColl}
            setSelectedColl={this.setSelectedColl}
          />
        </div>

        <TabNav
          tabs={['Add / Remove Collateral', 'Mint / Burn dVIX']}
          selected={selected}
          setSelected={this.setSelected}
        >
          <Tab isSelected={selected === 'Add / Remove Collateral'}>
            <p>Add / Remove Collateral</p>
          </Tab>
          <Tab isSelected={selected === 'Mint / Burn dVIX'}>
            <p>Mint / Burn dVIX</p>
          </Tab>
        </TabNav>
        {children}
      </div>
    )
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

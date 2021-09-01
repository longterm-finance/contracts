import React, { useState, useEffect, useContext } from 'react'
import './vault.css'
import dai from '../../assets/images/dai.png'
import wbtc from '../../assets/images/wbtc.png'
import eth from '../../assets/images/eth.png'
import avix from '../../assets/images/favicon.png'
import dvix from '../../assets/images/dVIX_favicon.png'
import usdc from '../../assets/images/usdc.png'
import { ThemeContext } from '../../state/ThemeContext'

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

const Vault = ({ collateral }) => {
  const { isDarkMode } = useContext(ThemeContext)
  const [selected, setSelected] = useState('Add / Remove Collateral')
  const [selectedColl, setSelectedColl] = useState('AVAX')

  useEffect(() => {
    const loadBlockchainData = async (dispatch) => {
      console.log('Load blockchain data...')
    }

    loadBlockchainData()
  }, [])

  const handleSelected = (tab) => setSelected(tab)
  const handleSelectedColl = (collOption) => setSelectedColl(collOption)

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
              name: 'AVAX',
              src: eth,
            },
            {
              name: 'WETH',
              src: eth,
            },
            {
              name: 'WBTC',
              src: wbtc,
            },
            {
              name: 'DAI',
              src: dai,
            },
            {
              name: 'USDT',
              src: usdc,
            },
          ]}
          selectedColl={selectedColl}
          setSelectedColl={handleSelectedColl}
        />
      </div>

      <TabNav
        tabs={['Add / Remove Collateral', 'Mint / Burn dVIX']}
        selected={selected}
        setSelected={handleSelected}
      >
        <Tab isSelected={selected === 'Add / Remove Collateral'}>
          <p>Add / Remove Collateral</p>
        </Tab>
        <Tab isSelected={selected === 'Mint / Burn dVIX'}>
          <p>Mint / Burn dVIX</p>
        </Tab>
      </TabNav>
      <h1>{collateral}</h1>
    </div>
  )
}

export const AVAXVault = () => <Vault collateral={'AVAX Vault'} />

export const WETHVault = () => <Vault collateral={'WETH Vault'} />

export const WBTCVault = () => <Vault collateral={'WBTC Vault'} />

export const DAIVault = () => <Vault collateral={'DAI Vault'} />

export const USDTVault = () => <Vault collateral={'USDT Vault'} />

export default Vault

import { Currency, ETHER, Token } from '@uniswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import EthereumLogo from '../../assets/images/matic-logo.jpg'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

const getTokenLogoURL = (address: string) =>{
  
    let tokens: any = {
      '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063': {
        chainId: 137,
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
        name: 'DAI',
        symbol: 'DAI',
        decimals: 18,
        logoURI: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=006'
      },
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': {
        chainId: 137,
        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
        logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=006'
      },
      '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': {
        chainId: 137,
        address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
        name: 'WETH',
        symbol: 'WETH',
        decimals: 18,
        logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
      },
      '0x4c28f48448720e9000907bc2611f73022fdce1fa': {
        chainId: 137,
        address: '0x4c28f48448720e9000907bc2611f73022fdce1fa',
        name: 'wMatic',
        symbol: 'wMatic',
        decimals: 18,
        logoURI: 'https://cryptologos.cc/logos/matic-network-matic-logo.svg?v=006'
      },
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f': {
        chainId: 137,
        address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        name: 'USDT',
        symbol: 'USDT',
        decimals: 6,
        logoURI: 'https://seeklogo.com/images/T/tether-usdt-logo-FA55C7F397-seeklogo.com.png'
      },
      '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6': {
        chainId: 137,
        address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
        name: 'WBTC',
        symbol: 'WBTC',
        decimals: 8,
        logoURI: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png?1548822744'
      }
    }
    
  return tokens[address.toLowerCase()] ? tokens[address.toLowerCase()].logoURI : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
}

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }

      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}

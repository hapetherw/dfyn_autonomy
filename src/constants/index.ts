import { ChainId, JSBI, Percent, Token, WETH } from '@uniswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'
import usdcABI from "./abis/usdc.json"
import tokenABI from "./abis/token.json"

import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'

export const ROUTER_ADDRESS = '0xA102072A4C07F06EC3B4900FDC4C7B80b6c57429'
export const biconomyAPIKey = 'C_Or9KnXC.e31d2693-40a4-4adf-bc19-e67af30ee040';
// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const DAI = new Token(ChainId.MATIC, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MATIC, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.MATIC, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, 'USDT', 'Tether USD')
export const mWETH = new Token(ChainId.MATIC, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'ETH', 'Ether')
export const ROUTE = new Token(ChainId.MATIC, '0x16eccfdbb4ee1a85a33f3a9b21175cd7ae753db4', 18, 'ROUTE', 'Route')
export const OM = new Token(ChainId.MATIC, '0xc3ec80343d2bae2f8e680fdadde7c17e71e114ea', 18, 'OM', 'Mantra Dao')
export const EASY = new Token(ChainId.MATIC, '0xdb3b3b147a030f032633f6c4bebf9a2fb5a882b5', 18, 'EASY', 'Easy')
export const RAZOR = new Token(ChainId.MATIC, '0xc91c06db0f7bffba61e2a5645cc15686f0a8c828', 18, 'RAZOR', 'Razor')
export const IGG = new Token(ChainId.MATIC, '0xe6fc6c7cb6d2c31b359a49a33ef08ab87f4de7ce', 6, 'IGG', 'IGG')
export const QUICK = new Token(ChainId.MATIC, '0x831753dd7087cac61ab5644b308642cc1c33dc13', 18, 'QUICK', 'Quick')
export const COR = new Token(ChainId.MATIC, '0x4fdce518fe527439fe76883e6b51a1c522b61b7c', 18, 'COR', 'Coreto')
export const FRONT = new Token(ChainId.MATIC, '0xa3ed22eee92a3872709823a6970069e12a4540eb', 18, 'FRONT', 'Frontier')
export const GLCH = new Token(ChainId.MATIC, '0xbe5cf150e1ff59ca7f2499eaa13bfc40aae70e78', 18, 'GLCH', 'Glitch')
export const STR = new Token(ChainId.MATIC, '0xa79e0bfc579c709819f4a0e95d4597f03093b011', 18, 'STR', 'Stater')
export const UNN = new Token(ChainId.MATIC, '0x67480287cb3715d1d9429b38772c71d6e94c16da', 18, 'UNN', 'Union')
export const NORD = new Token(ChainId.MATIC, '0xf6f85b3f9fd581c2ee717c404f7684486f057f95', 18, 'NORD', 'Nord')
export const RAGE = new Token(ChainId.MATIC, '0x40ccd55b789fdee8d434915dc2aa6bd938506a92', 18, 'RAGE', 'Rage')


const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
  [ChainId.MATIC]: [WETH[ChainId.MATIC]]
}

export const WETH_V2 = new Token(ChainId.MATIC, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WMATIC', 'WMATIC')
// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MATIC]: [...WETH_ONLY[ChainId.MATIC], DAI, USDC, USDT, mWETH, ROUTE, OM, EASY, IGG, RAZOR, QUICK, COR, FRONT, GLCH, STR, UNN, NORD, RAGE]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MATIC]: {
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MATIC]: []
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MATIC]: [...WETH_ONLY[ChainId.MATIC], DAI, USDC, USDT, mWETH, ROUTE, OM, EASY, IGG, RAZOR, QUICK]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MATIC]: [
    [USDC, USDT],
    [DAI, USDT]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
}

export const META_TXN_SUPPORTED_TOKENS: any = {
  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f": { "abi": tokenABI },
  "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619": { "abi": tokenABI },
  "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": { "abi": usdcABI },
  "0x8505b9d2254a7ae468c0e9dd10ccea3a837aef5c": { "abi": tokenABI },
  "0x313d009888329c9d1cf4f75ca3f32566335bd604": { "abi": tokenABI },
  "0xda537104d6a5edd53c6fbba9a898708e465260b6": { "abi": tokenABI },
  "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063": { "abi": tokenABI },
  "0xdab529f40e671a1d4bf91361c21bf9f0c9712ab7": { "abi": tokenABI },
  "0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4": { "abi": tokenABI },
  "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6": { "abi": tokenABI },
  "0x71b821aa52a49f32eed535fca6eb5aa130085978": { "abi": tokenABI },
  "0x578360adf0bbb2f10ec9cec7ef89ef495511ed5f": { "abi": tokenABI },
  "0x556f501cf8a43216df5bc9cc57eb04d4ffaa9e6d": { "abi": tokenABI },
  "0xeab9cfb094db203e6035c2e7268a86debed5bd14": { "abi": tokenABI },
  "0xb33eaad8d922b1083446dc23f610c2567fb5180f": { "abi": tokenABI },
  "0x5a2fdf906ada9353ebe496fa5d351b39f8908d19": { "abi": tokenABI },
  "0xe6fc6c7cb6d2c31b359a49a33ef08ab87f4de7ce": { "abi": tokenABI },
  "0x16eccfdbb4ee1a85a33f3a9b21175cd7ae753db4": { "abi": tokenABI },
  "0x03247a4368a280bec8133300cd930a3a61d604f6": { "abi": tokenABI },
  "0x840195888db4d6a99ed9f73fcd3b225bb3cb1a79": { "abi": tokenABI },
  "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39": { "abi": tokenABI },
  "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7": { "abi": tokenABI },
  "0x462d8d82c2b2d2ddabf7f8a93928de09d47a5807": { "abi": tokenABI },
  "0x72d6066f486bd0052eefb9114b66ae40e0a6031a": { "abi": tokenABI },
  "0xc3ec80343d2bae2f8e680fdadde7c17e71e114ea": { "abi": tokenABI },
  "0xc91c06db0f7bffba61e2a5645cc15686f0a8c828": { "abi": tokenABI },
  '0x4fdce518fe527439fe76883e6b51a1c522b61b7c': { "abi": tokenABI },
  '0xa3ed22eee92a3872709823a6970069e12a4540eb': { "abi": tokenABI },
  '0xbe5cf150e1ff59ca7f2499eaa13bfc40aae70e78': { "abi": tokenABI },
  '0xf6f85b3f9fd581c2ee717c404f7684486f057f95': { "abi": tokenABI },
  '0x40ccd55b789fdee8d434915dc2aa6bd938506a92': { "abi": tokenABI },
  '0xa79e0bfc579c709819f4a0e95d4597f03093b011': { "abi": tokenABI }
}


export const META_TXN_DISABLED = false
// export const META_TXN_SUPPORTED_TOKENS: any = {}
export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))

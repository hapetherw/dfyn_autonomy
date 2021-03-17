import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { Trade, TokenAmount, CurrencyAmount, ETHER } from '@uniswap/sdk'
import { useCallback, useMemo } from 'react'
import { ROUTER_ADDRESS, biconomyAPIKey, META_TXN_SUPPORTED_TOKENS, META_TXN_DISABLED } from '../constants'
import { useTokenAllowance } from '../data/Allowances'
import { getTradeVersion, useV1TradeExchangeAddress } from '../data/V1'
import { Field } from '../state/swap/actions'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { computeSlippageAdjustedAmounts } from '../utils/prices'
import { calculateGasMargin } from '../utils'
import { useTokenContract } from './useContract'
import { useActiveWeb3React } from './index'
import { splitSignature } from '@ethersproject/bytes'
import { Version } from './useToggledVersion'
const Biconomy = require("@biconomy/mexa")
const Web3 = require("web3");
// swap, add Liquidity

const maticProvider = process.env.REACT_APP_NETWORK_URL
const biconomy = new Biconomy(
  new Web3.providers.HttpProvider(maticProvider),
  {
    apiKey: biconomyAPIKey,
    debug: true
  }
);
const getWeb3 = new Web3(biconomy);
biconomy
  .onEvent(biconomy.READY, () => {
    console.log("Mexa is Ready");
  })

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { account, chainId, library } = useActiveWeb3React()
  if (!chainId) throw "";
  if (!library) throw "";
  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()


  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }
    if (META_TXN_SUPPORTED_TOKENS[token.address.toLowerCase()] && !META_TXN_DISABLED) {
      //start
      const metaToken = META_TXN_SUPPORTED_TOKENS[token.address.toLowerCase()]
      const bicomony_contract = new getWeb3.eth.Contract(metaToken.abi, token.address);
      let nonceMethod = bicomony_contract.methods.getNonce || bicomony_contract.methods.nonces 
      let biconomy_nonce = await nonceMethod(account).call();
      let res = bicomony_contract.methods.approve(spender, MaxUint256.toString()).encodeABI()
      let message: any = {};
      let name = await bicomony_contract.methods.name().call()
      message.nonce = parseInt(biconomy_nonce);
      message.from = account;
      message.functionSignature = res;

      const dataToSign = JSON.stringify({
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "verifyingContract", type: "address" },
            { name: "salt", type: "bytes32" }
          ],
          MetaTransaction: [
            { name: "nonce", type: "uint256" },
            { name: "from", type: "address" },
            { name: "functionSignature", type: "bytes" }
          ]
        },
        domain: {
          name,
          version: "1",
          verifyingContract: token.address,
          salt: '0x' + chainId.toString(16).padStart(64, '0')
        },
        primaryType: "MetaTransaction",
        message
      });
      return library
        .send('eth_signTypedData_v4', [account, dataToSign]).then(splitSignature).then(({v, r, s})=>{
          // TODO: fix approving delay on UI
          bicomony_contract.methods
        .executeMetaTransaction(account, res, r, s, v)
        .send({
          from: account
        })
        .then((response: any) => {
          if (!response.hash)
            response.hash = response.transactionHash;
          addTransaction(response, {
            summary: 'Approve ' + amountToApprove.currency.symbol,
            approval: { tokenAddress: token.address, spender: spender }
          })
        })
        .catch((error: Error) => {
          console.debug('Failed to approve token', error)
          throw error
        })
        })
    }
    //end
    else {
      let useExact = false
      const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
        // general fallback for tokens who restrict approval amounts
        useExact = true
        return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString())
      })
      return tokenContract
        .approve(spender, useExact ? amountToApprove.raw.toString() : MaxUint256, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Approve ' + amountToApprove.currency.symbol,
            approval: { tokenAddress: token.address, spender: spender }
          })
        })
        .catch((error: Error) => {
          console.debug('Failed to approve token', error)
          throw error
        })
    }
  }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction])

  return [approvalState, approve]
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(trade?: Trade, allowedSlippage = 0) {
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage]
  )
  const tradeIsV1 = getTradeVersion(trade) === Version.v1
  const v1ExchangeAddress = useV1TradeExchangeAddress(trade)
  return useApproveCallback(amountToApprove, tradeIsV1 ? v1ExchangeAddress : ROUTER_ADDRESS)
}

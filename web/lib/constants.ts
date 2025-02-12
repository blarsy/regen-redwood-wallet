import { AppCurrency } from "@keplr-wallet/types"

export const CHAIN_ID = 'regen-redwood-1'
export const RPC_ENDPOINT = 'http://redwood.regen.network:26657/'
export const CURRENCY: AppCurrency =  {
    coinDenom: 'REGEN',
    coinMinimalDenom: 'uregen',
    coinDecimals: 6,
}
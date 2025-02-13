import { Coin, Key, StdFee } from "@keplr-wallet/types"
import { CHAIN_ID, CURRENCY, RPC_ENDPOINT } from "./constants"
import { getSigningRegenClient, regen, cosmos } from '@regen-network/api'


export const suggestRedwoodChain = async () => {
    if(!window.keplr) throw new Error('ensure window.keplr is defined')
    await window.keplr!.experimentalSuggestChain({
        chainId: CHAIN_ID,
        chainName: 'Regen Redwood Testnet',
        rpc: RPC_ENDPOINT,
        rest: 'http://redwood.regen.network:1317/',
        stakeCurrency: CURRENCY,
        bip44: { coinType: 118 },
        bech32Config: {
          bech32PrefixAccAddr: 'regen',
          bech32PrefixAccPub: 'regenpub',
          bech32PrefixValAddr: 'regenvaloper',
          bech32PrefixValPub: 'regenvaloperpub',
          bech32PrefixConsAddr: 'regenvalcons',
          bech32PrefixConsPub: 'regenvalconspub',
        },
        currencies: [
          CURRENCY,
        ],
        feeCurrencies: [
          {
            ...CURRENCY,
            gasPriceStep: {
              low: 0.01,
              average: 0.025,
              high: 0.04,
            },
          },
      
        ],  
        features: ['stargate'],
    })
    return window.keplr.getKey(CHAIN_ID)
}

export interface RedwoodBalance {
    coin: Coin
    key: Key
}

export const getBalance = async (): Promise<RedwoodBalance> => {
    const { createRPCQueryClient } = regen.ClientFactory

    const client = await createRPCQueryClient({ rpcEndpoint:RPC_ENDPOINT })
    const key = await window.keplr!.getKey(CHAIN_ID)
    
    const balanceQry = await client.cosmos.bank.v1beta1
        .balance({ address: key.bech32Address, denom: CURRENCY.coinMinimalDenom })

    if(balanceQry.balance) {
        return {
            coin: balanceQry.balance,
            key
        }
    }

    return { coin: { denom: CURRENCY.coinDenom, amount: '0' }, key }
}

export const sendRegen = async (toAddress: string, amount: number): Promise<{ success: boolean, response: any }> => {
    if(!window.keplr) throw new Error('ensure window.keplr is defined')
    
    const signer = await window.keplr.getOfflineSigner(CHAIN_ID)
    const key = await window.keplr!.getKey(CHAIN_ID)
    const stargateClient = await getSigningRegenClient({
        rpcEndpoint:RPC_ENDPOINT,
        signer
    })

    const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl

    const msg = send({
        amount: [
            {
                denom: CURRENCY.coinMinimalDenom,
                amount: (amount * 1000000).toString()
            }
        ],
        toAddress,
        fromAddress: key.bech32Address
    })

    const fee: StdFee = {
        amount: [
            {
                denom: CURRENCY.coinMinimalDenom,
                amount: (amount * 1000000).toString()
            }
        ],
        gas: '100000'
    }

    const response = await stargateClient.signAndBroadcast(key.bech32Address, [msg], fee)
    if(response.code != 0)
        throw new Error(`Error code ${response.code} while sending REGEN's to target address. Tx details: ${JSON.stringify(response)}`)
}
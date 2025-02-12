import { CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { regen } from '@regen-network/api'
import { CHAIN_ID, RPC_ENDPOINT } from "@/lib/constants"
import { Coin } from "@keplr-wallet/types"
import { DataLoadState } from "@/lib/DataLoadState"
import CoinBalance from "./CoinBalance"

const Wallet = () => {
    const [balances, setBalances] = useState<DataLoadState<Coin[]>>({ loading: true })

    const load = async () => {
        const { createRPCQueryClient } = regen.ClientFactory

        try {
            const client = await createRPCQueryClient({ rpcEndpoint:RPC_ENDPOINT })
            const key = await window.keplr!.getKey(CHAIN_ID)
            
            const balancesQry = await client.cosmos.bank.v1beta1
                .allBalances({ address: key.bech32Address })
            
            setBalances({ loading: false, data: balancesQry.balances })
        } catch (e) {
            setBalances({ loading: false, error: e as Error })
        }
    }

    useEffect(() => {
        load()
    }, [])
    return <Stack>
        <Typography variant="h4" align="center">Balances</Typography>
        { 
            balances.loading ? <CircularProgress /> :
            balances.data!.map((coin, idx) => (<CoinBalance coin={coin} key={idx} />) )
        }
    </Stack>
}

export default Wallet
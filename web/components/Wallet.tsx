import { Button, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { DataLoadState } from "@/lib/DataLoadState"
import CoinBalance from "./CoinBalance"
import { getBalance, RedwoodBalance } from "@/lib/wallet-client"

const Wallet = () => {
    const [balance, setBalance] = useState<DataLoadState<RedwoodBalance>>({ loading: true })

    const load = async () => {
        try {
            setBalance({ loading: true })
            const balance = await getBalance()
            setBalance({ loading: false, data: balance })
        } catch(e) {
            setBalance({ loading: false, error: e as Error })
        }
    }

    useEffect(() => {
        load()
    }, [])
    return <Stack sx={{ gap: '2rem', minWidth: '300px', alignItems: "center"}}>
        <Typography variant="h4" align="center">Balances</Typography>
        { 
            balance.loading ? 
            <CircularProgress size="2rem" /> :
            <CoinBalance balance={balance.data!}  />
        }
        <Button loading={balance.loading} variant="contained" onClick={load}>Refresh</Button>
    </Stack>
}

export default Wallet
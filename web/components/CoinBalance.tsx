import { Coin } from "@keplr-wallet/types"
import { Stack, Typography, Button } from "@mui/material"
import { useState } from "react"
import SendDialog from "./SendDialog"
import { CURRENCY } from "@/lib/constants"

const CoinBalance = (p: { coin: Coin }) => {
    const [sendingCoin, setSendingCoin] = useState<Coin | undefined>()
    let prettifiedCoin: Coin
    if(p.coin.denom.toLowerCase() === CURRENCY.coinMinimalDenom) {
        prettifiedCoin = { denom: CURRENCY.coinDenom, amount: (Number(p.coin.amount) / Math.pow(10, CURRENCY.coinDecimals)).toString() }
    } else {
        prettifiedCoin = p.coin
    }

    return <Stack direction="row" sx={{ minWidth: '250px', justifyContent: 'space-between', alignItems:'center' }}>
        <Typography variant="body1">{prettifiedCoin.denom}</Typography>
        <Typography variant="body1">{prettifiedCoin.amount}</Typography>
        <Button variant="contained" onClick={() => {
            setSendingCoin(p.coin)
        }} color="primary">Send</Button>
        <SendDialog coin={sendingCoin}/>
    </Stack>
}

export default CoinBalance
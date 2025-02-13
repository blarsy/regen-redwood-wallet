import { Coin } from "@keplr-wallet/types"
import { Stack, Typography, Button, Alert } from "@mui/material"
import { useState } from "react"
import SendDialog from "./SendDialog"
import { CURRENCY } from "@/lib/constants"
import { RedwoodBalance } from "@/lib/wallet-client"

const first15 = (text: string) => `${text.substring(0, 15)}...`

const CoinBalance = (p: { balance: RedwoodBalance }) => {
    const [sendingCoin, setSendingCoin] = useState<Coin | undefined>()
    const [successMessage, setSuccessMessage] = useState('')
    let prettifiedCoin: Coin
    if(p.balance.coin.denom.toLowerCase() === CURRENCY.coinMinimalDenom) {
        prettifiedCoin = { denom: CURRENCY.coinDenom, amount: (Number(p.balance.coin.amount) / Math.pow(10, CURRENCY.coinDecimals)).toString() }
    } else {
        prettifiedCoin = p.balance.coin
    }

    return <Stack sx={{ gap: '2rem' }}>
        <Typography variant="subtitle1" textAlign="center">{`Wallet ${first15(p.balance.key.bech32Address)}`}</Typography>
        <Stack direction="row" sx={{ minWidth: '250px', justifyContent: 'space-between', alignItems:'center' }}>
            <Typography variant="body1">{prettifiedCoin.denom}</Typography>
            <Typography variant="body1">{prettifiedCoin.amount}</Typography>
            <Button variant="contained" onClick={() => {
                setSendingCoin(prettifiedCoin)
            }} color="primary">Send</Button>
            <SendDialog coin={sendingCoin} onClose={successInfo => {
                setSendingCoin(undefined)
                if(successInfo) {
                    setSuccessMessage(`A transaction to send ${successInfo?.amount} ${CURRENCY.coinDenom} to ${successInfo?.address} has been successfully sent.`)
                }
            }}/>
        </Stack>
        { successMessage && <Alert severity="success" onClose={() => setSuccessMessage('')}>{successMessage}</Alert> }
    </Stack>
}

export default CoinBalance
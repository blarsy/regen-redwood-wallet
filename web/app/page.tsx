"use client"
import Wallet from "@/components/Wallet"
import { CHAIN_ID, CURRENCY, RPC_ENDPOINT } from "@/lib/constants"
import { Alert, CircularProgress, Container, Stack, Typography } from "@mui/material"
import { ReactNode, useEffect, useState } from "react"

export default function Home() {
  const [walletStatus, setWalletStatus] = useState({
    installed: false,
    connected: false,
    connecting: true,
    error: undefined as Error | undefined
  })
  const load = async () => {
    if(!window.keplr) {
      setWalletStatus({ connected: false, connecting: false, installed: false, error: undefined })
    } else {
      try {
        await window.keplr.experimentalSuggestChain({
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
        setWalletStatus({ connected: true, connecting: false, installed: true, error: undefined })
      } catch (e) {
        setWalletStatus({ connected: true, connecting: false, installed: true, error: undefined})
      }
    }
  }
  useEffect(() => {
    load()
  }, [])

  let content: ReactNode

  if(walletStatus.connecting) {
    content = (<Stack sx={{ alignItems: 'center' }}>
      <CircularProgress />
      <Typography variant="subtitle1">Connecting ...</Typography>
    </Stack>)
  } else if (!walletStatus.installed) {
    content = (<Alert severity="error">Looks like Keplr is not installed in your browser. See <a target="_blank" href="https://www.keplr.app/get">here</a>.</Alert>)
  } else {
    content = (<Wallet />)
  }

  return (<Container sx={{ justifyItems: 'center', marginTop: '2rem' }}>
    { content }
  </Container>)
}

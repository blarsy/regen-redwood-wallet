"use client"
import useWallet from "@/components/useWallet"
import Wallet from "@/components/Wallet"
import { Alert, CircularProgress, Container, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"

export default function Home() {
  const { connecting, installed, error } = useWallet()

  let content: ReactNode

  if(connecting) {
    content = <Stack sx={{ alignItems: 'center' }}>
      <CircularProgress />
      <Typography variant="subtitle1">Connecting ...</Typography>
    </Stack>
  } else if (!installed) {
    content = <Alert severity="error">Looks like Keplr is not installed in your browser. See <a target="_blank" href="https://www.keplr.app/get">here</a>.</Alert>
  } else if (error) {
    content = <Alert severity="error">{`There was an error when connecting to your wallet: ${error.message}`}</Alert>
  } else {
    content = <Wallet />
  }

  return <Container sx={{ justifyItems: 'center', marginTop: '2rem' }}>
    { content }
  </Container>
}

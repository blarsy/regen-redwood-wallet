import { useEffect, useState } from "react"
import { suggestRedwoodChain } from "@/lib/wallet-client"
import { Key } from "@keplr-wallet/types"

interface WalletStatus {
    installed: boolean,
    connecting: boolean,
    error?: Error,
    key?: Key
}

const useWallet = () => {
    const [walletStatus, setWalletStatus] = useState<WalletStatus>({
        installed: false,
        connecting: true,
        error: undefined as Error | undefined
    })
    
    const load = async () => {
        if(!window.keplr) {
          setWalletStatus({ connecting: false, installed: false, error: undefined })
        } else {
          try {
            const key = await suggestRedwoodChain()
            
            setWalletStatus({ connecting: false, installed: true, error: undefined, key })
          } catch (e) {
            setWalletStatus({ connecting: false, installed: true, error: e as Error})
          }
        }
    }
    useEffect(() => {
        load()
    }, [])

    return walletStatus
}

export default useWallet
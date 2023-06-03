import useMasterWallet from '@/hooks/useMasterWallet'
import { Keypair } from '@solana/web3.js'
import { decode } from 'bs58'
import { useEffect } from 'react'

export default function ParimutualProvider() {
  const setKeyair = useMasterWallet((state) => state.setKeyair)

  useEffect(() => {
    setKeyair(Keypair.fromSecretKey(decode(process.env.NEXT_PUBLIC_MASTER_WALLET_PRIVATE_KEY as string)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div>P</div>
}

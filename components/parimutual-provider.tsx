import useMasterWallet from '@/hooks/useMasterWallet'
import { Keypair, PublicKey } from '@solana/web3.js'
import { decode } from 'bs58'
import { useEffect, useMemo } from 'react'
import { DEVNET_CONFIG, MarketPairEnum, Parimutuel, ParimutuelWeb3, getMarketPubkeys } from '@hxronetwork/parimutuelsdk'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import BN from 'bn.js'

export default function ParimutualProvider() {
  const [keypair, setKeyair] = useMasterWallet((state) => [state.keypair, state.setKeyair])
  const { connection } = useConnection()
  const parimutuelWeb3 = useMemo(() => new ParimutuelWeb3(DEVNET_CONFIG, connection), [connection])
  const marketPubkey = getMarketPubkeys(DEVNET_CONFIG, MarketPairEnum.SOLUSD)[0].pubkey
  const { publicKey } = useWallet()

  useEffect(() => {
    setKeyair(Keypair.fromSecretKey(decode(process.env.NEXT_PUBLIC_MASTER_WALLET_PRIVATE_KEY as string)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <button className='btn btn-primary'>Create pari</button>
    </div>
  )
}

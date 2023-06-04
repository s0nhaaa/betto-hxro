import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { BackpackWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { ReactNode, useMemo } from 'react'

import '@solana/wallet-adapter-react-ui/styles.css'

type WalletAdapterProps = {
  children: ReactNode
}

export default function WalletAdapter(props: WalletAdapterProps) {
  const network = WalletAdapterNetwork.Devnet

  // const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const endpoint = 'https://rpc-devnet.helius.xyz/?api-key=952219b9-42f3-4b93-b8c3-0ecc416f5a9d'

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new BackpackWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{props.children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

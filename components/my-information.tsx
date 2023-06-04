import { formatWallet } from '@/utils/format-wallet'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import Avatar from 'boring-avatars'
import { useEffect, useState } from 'react'

export default function MyInformation() {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [solBalance, setSOLBalance] = useState('')

  useEffect(() => {
    const getSOLBalance = async () => {
      if (!publicKey) return
      const lamportBalance = await connection.getBalance(publicKey, { commitment: 'confirmed' })
      setSOLBalance((lamportBalance / LAMPORTS_PER_SOL).toFixed(2))
    }

    getSOLBalance()
  }, [connection, publicKey])

  return (
    <>
      {publicKey && (
        <div className='absolute flex gap-3 items-center top-6 right-6 rounded-3xl bg-base-200 p-4'>
          <button className='btn btn-active no-animation'>{solBalance} SOL</button>
          <span className='text-neutral-content font-bold text-lg select-none'>
            {formatWallet(publicKey.toString())}
          </span>
          <Avatar
            size={40}
            name={publicKey.toString()}
            variant='beam'
            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
          />
        </div>
      )}
    </>
  )
}

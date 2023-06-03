import usePlayerWallet from '@/hooks/usePlayerWalletAddress'
import { formatWallet } from '@/utils/format-wallet'
import Avatar from 'boring-avatars'

export default function MyInformation() {
  const wallet = usePlayerWallet((state) => state.wallet)
  const playerWallet = usePlayerWallet((state) => state.wallet)

  return (
    <div className='absolute flex gap-3 items-center top-6 right-6 rounded-3xl bg-base-200 p-4'>
      <div className='tooltip' data-tip='hello'>
        <button className='btn btn-active btn-ghost'>2 SOL</button>
      </div>
      <div className='tooltip' data-tip='hello'>
        <button className='btn btn-active btn-ghost'>2 SOL</button>
      </div>
      <span className='text-neutral-content font-bold text-lg select-none'>{formatWallet(wallet)}</span>
      <Avatar
        size={40}
        name={playerWallet}
        variant='beam'
        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
      />
    </div>
  )
}

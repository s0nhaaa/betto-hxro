import useOnBoardingModal from '@/hooks/useOnboardingModal'
import { formatWallet } from '@/utils/format-wallet'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import clsx from 'clsx'

export default function OnboardingModal() {
  const { publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const modal = useOnBoardingModal()

  const changeWallet = async () => {
    await disconnect()
    setVisible(true)
  }

  return (
    <>
      <dialog
        id='my_modal_1'
        className={clsx('modal', {
          'modal-open': modal.isOpen,
        })}>
        <form method='dialog' className='modal-box'>
          <h3 className='font-bold text-lg'>
            Welcom {publicKey ? `${formatWallet(publicKey.toString())} 👋` : 'to Betto!'}
          </h3>
          <p className='py-4 text-neutral-content'>Press ESC key or click the button below to close</p>
          <div className='modal-action'>
            {!publicKey ? (
              <>
                <button className='btn btn-primary' onClick={() => setVisible(true)}>
                  Connect Wallet
                </button>
              </>
            ) : (
              <>
                <button className='btn' onClick={changeWallet}>
                  Change Wallet
                </button>
                <button className='btn btn-primary' onClick={() => modal.setIsOpen(false)}>
                  Jump in
                </button>
              </>
            )}
          </div>
        </form>
      </dialog>
    </>
  )
}

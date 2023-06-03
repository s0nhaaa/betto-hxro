'use client'

import OnboardingModal from '@/components/onboarding-modal'
import WalletAdapter from '@/components/wallet-adapter'

export default function Home() {
  return (
    <WalletAdapter>
      <main className='h-screen w-full bg-base-100'>
        <OnboardingModal />
      </main>
    </WalletAdapter>
  )
}

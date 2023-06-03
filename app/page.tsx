'use client'

import Avatars from '@/components/avatars'
import MyInformation from '@/components/my-information'
import OnboardingModal from '@/components/onboarding-modal'
import ParimutualProvider from '@/components/parimutual-provider'
import Scene from '@/components/scene'
import WalletAdapter from '@/components/wallet-adapter'

export default function Home() {
  return (
    <WalletAdapter>
      <main className='relative h-screen w-full bg-base-100'>
        <ParimutualProvider />

        <OnboardingModal />
        <Scene />

        <MyInformation />

        <Avatars />
      </main>
    </WalletAdapter>
  )
}

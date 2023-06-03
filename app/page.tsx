'use client'

import OnboardingModal from '@/components/onboarding-modal'
import Scene from '@/components/scene'
import WalletAdapter from '@/components/wallet-adapter'

export default function Home() {
  return (
    <WalletAdapter>
      <main className='h-screen w-full bg-base-100'>
        <OnboardingModal />
        <Scene />

        {/* <Avatar
  size={40}
  name="Maria Mitchell"
  variant="marble"
  colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
/>; */}
      </main>
    </WalletAdapter>
  )
}

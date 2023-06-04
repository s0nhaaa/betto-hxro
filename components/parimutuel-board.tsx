// @ts-nocheck

import { parimutualConfig } from '@/configs/hxro'
import useParimutuel from '@/hooks/useParimutuel'
import { ParimutuelObject } from '@/types/parimutuel-object'
import { formatWallet } from '@/utils/format-wallet'
import { MarketPairEnum, ParimutuelWeb3, calculateNetOdd, getMarketPubkeys } from '@hxronetwork/parimutuelsdk'
import { useConnection } from '@solana/wallet-adapter-react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useCopyToClipboard } from 'react-use'

export default function ParimutuelBoard() {
  const [parimutuelObject, setParimutuelObject] = useState<ParimutuelObject>()
  const [countdownMinutes, setCountdownMinutes] = useState(0)
  const [countdownSeconds, setCountdownSeconds] = useState(0)

  const { connection } = useConnection()
  const [state, copyToClipboard] = useCopyToClipboard()

  const parimutuelWeb3 = useMemo(() => new ParimutuelWeb3(parimutualConfig.config, connection), [connection])
  const marketPubkey = useMemo(() => getMarketPubkeys(parimutualConfig.config, MarketPairEnum.SOLUSD)[0], [])

  const [parimutuelPubkey, setParimutuelPubkey] = useParimutuel((state) => [
    state.parimutuelPubkey,
    state.setParimutuelPubkey,
  ])

  useEffect(() => {
    const getPariData = async () => {
      try {
        localStorage.clear()
        const parimutuels = await parimutuelWeb3.getParimutuels([marketPubkey])
        const duration = 60
        const pariMarkets = parimutuels.filter((account) => {
          return (
            account.info.parimutuel.timeWindowStart.toNumber() > Date.now() &&
            account.info.parimutuel.timeWindowStart.toNumber() < Date.now() + duration * 1000
          )
        })

        let longPool: any = pariMarkets[0].info.parimutuel.activeLongPositions.toNumber() / 1_000_000_000
        let shortPool: any = pariMarkets[0].info.parimutuel.activeShortPositions.toNumber() / 1_000_000_000
        const longOdds = calculateNetOdd(longPool, longPool + shortPool, 0.03)
        const shortOdds = calculateNetOdd(shortPool, longPool + shortPool, 0.03)
        const pubkey = pariMarkets[0].pubkey.toString()
        const locksTime = pariMarkets[0].info.parimutuel.timeWindowStart.toNumber()

        if (locksTime) {
          const currentTime = new Date().getTime()
          const timeDiff = locksTime - currentTime
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
          setCountdownMinutes(minutes)
          setCountdownSeconds(seconds)
        }

        longPool = longPool.toFixed(2)
        shortPool = shortPool.toFixed(2)

        setParimutuelPubkey(pubkey)
        setParimutuelObject({ longPool, shortPool, longOdds, shortOdds, pubkey })
      } catch (error) {
        console.error(error)
      }
    }

    const intervalId = setInterval(() => getPariData(), 1000)

    return () => clearInterval(intervalId)
  }, [marketPubkey, parimutuelWeb3])

  return (
    <div className='absolute z-10 flex items-center flex-col  rounded-3xl border-4 border-neutral p-4 bg-base-200 left-[50%] translate-x-[-50%] top-6'>
      <div className='flex'>
        <div className='flex flex-col'>
          <span className=' text-md font-semibold text-neutral-content'>Next round</span>
          {parimutuelObject?.pubkey && (
            <div className='tooltip tooltip-bottom' data-tip='Copy'>
              <button
                className='btn no-animation btn-active mt-3 normal-case text-lg'
                onClick={() => copyToClipboard(parimutuelObject.pubkey)}>
                {formatWallet(parimutuelObject.pubkey, 6)}
              </button>
            </div>
          )}
        </div>

        <div className='flex w-full justify-around ml-4 gap-2'>
          <div className='flex flex-col items-center bg-base-100 p-4 rounded-xl'>
            <span className=' text-md font-semibold text-neutral-content flex gap-2 items-center'>
              <ArrowUp size={18} className='text-success' />
            </span>
            <span className=' text-xl font-semibold text-neutral-content mt-2'>{parimutuelObject?.longPool}</span>
            <span className=' text-sm font-semibold text-neutral-content mt-1'>(x{parimutuelObject?.longOdds})</span>
          </div>
          <div className='flex flex-col items-center bg-base-100 p-4 rounded-xl'>
            <span className=' text-md font-semibold text-neutral-content flex gap-2 items-center'>
              <ArrowDown size={18} className='text-error' />
            </span>
            <span className=' text-xl font-semibold text-neutral-content mt-1'>{parimutuelObject?.shortPool}</span>
            <span className=' text-sm font-semibold text-neutral-content mt-1'>(x{parimutuelObject?.shortOdds})</span>
          </div>
        </div>
      </div>

      <span className='countdown font-mono text-2xl mt-4'>
        <span style={{ '--value': countdownMinutes }}></span>m<span style={{ '--value': countdownSeconds }}></span>s
      </span>
    </div>
  )
}

import Ground from '@/components/ground'
import MainPlayer from '@/components/main-player'
import Player from '@/components/player'
import { auth, database } from '@/configs/firebase'
import usePlayerStore from '@/stores/player'
import { Loader } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { onValue, ref, remove, set } from 'firebase/database'
import { useEffect, useState } from 'react'
import { useKeyPressEvent } from 'react-use'
import AmountOption from './amount-option'
import Arrow from './arrow'
import Hint from './hint'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { ParimutuelWeb3, PositionSideEnum, WalletSigner } from '@hxronetwork/parimutuelsdk'
import { parimutualConfig } from '@/configs/hxro'
import useParimutuel from '@/hooks/useParimutuel'

export default function Scene() {
  const [mainPlayerUid, setMainPlayerUid] = useState('')
  const [isSignIn, setIsSignIn] = useState(false)
  const [players, setPlayers] = usePlayerStore((state) => [state.players, state.setPlayers])
  const [isReadyLong, setIsReadyLong] = useState(false)
  const [isReadyShort, setIsReadyShort] = useState(false)
  const [showAmount, setShowAmount] = useState(false)
  const [placingPosition, setPlacingPosition] = useState(false)
  const [choosenAmount, setChoosenAmount] = useState(0)
  const [currentPosition, setCurrentPosition] = useState<'LONG' | 'SHORT' | undefined>()
  const { publicKey } = useWallet()
  const wallet = useWallet()
  const { connection } = useConnection()

  const [parimutuelPubkey, setParimutuelPubkey] = useParimutuel((state) => [
    state.parimutuelPubkey,
    state.setParimutuelPubkey,
  ])

  const parimutuelWeb3 = new ParimutuelWeb3(parimutualConfig.config, connection)

  useEffect(() => {
    signInAnonymously(auth)
      .then(() => {
        setIsSignIn(true)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
      })
  }, [])

  useEffect(() => {
    let uid: string

    publicKey &&
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          uid = user.uid
          setMainPlayerUid(uid)
          await set(ref(database, `players/${uid}`), {
            id: uid,
            walletAddress: publicKey.toString(),
            position: {
              x: 0,
              y: 0,
              z: 0,
            },
            quaternion: {
              x: 0,
              y: 0,
              z: 0,
              w: 0,
            },
          }).catch((error) => {
            console.log(error)
          })
        }
      })

    onValue(ref(database, 'players'), (snapshot) => {
      setPlayers(snapshot.val())
    })

    window.addEventListener('beforeunload', (event) => {
      remove(ref(database, `players/${uid}`))
    })
  }, [publicKey])

  useEffect(() => {
    if (!isSignIn) return

    onValue(
      ref(database, 'players'),
      (snapshot) => {
        setPlayers(snapshot.val())
      },
      {
        onlyOnce: true,
      },
    )
  }, [isSignIn, publicKey])

  const showPlaceAmount = () => {
    if (isReadyLong || isReadyShort) {
      isReadyLong && setCurrentPosition('LONG')
      isReadyShort && setCurrentPosition('SHORT')
      setIsReadyLong(false)
      setIsReadyShort(false)
      setShowAmount(true)
    }
  }

  const placePosition = async (amount: number) => {
    if (!currentPosition || !publicKey || placingPosition) return

    setChoosenAmount(amount)
    setPlacingPosition(true)
    const side = currentPosition === 'LONG' ? PositionSideEnum.LONG : PositionSideEnum.SHORT
    let transactionId = ''
    try {
      transactionId = await parimutuelWeb3.placePosition(
        wallet as WalletSigner,
        new PublicKey(parimutuelPubkey),
        amount * (10 ** 9 / 1),
        side,
        Date.now(),
      )

      if (transactionId) {
        console.log(`Transaction: ${transactionId}`)
        //   notify({ type: 'success', message: `Placed ${side === PositionSideEnum.LONG ? 'LONG' : 'SHORT'} Position`, txid: transactionId });
      }
    } catch (error: any) {
      // notify({ type: 'error', message: 'Transaction failed!', description: error.message, txid: transactionId });
      console.error(`Transaction failed! ${error.message}`, transactionId)
      // return;
    } finally {
      setPlacingPosition(false)
      setChoosenAmount(0)
    }
  }

  useKeyPressEvent(' ', showPlaceAmount)
  useKeyPressEvent('1', () => placePosition(1))
  useKeyPressEvent('2', () => placePosition(10))
  useKeyPressEvent('3', () => placePosition(100))
  useKeyPressEvent('4', () => placePosition(1000))

  return (
    <>
      <Canvas className='h-full w-full bg-scene-gradient' shadows>
        <directionalLight
          castShadow
          position={[20, 30, 10]}
          intensity={1.5}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={1}
          shadow-camera-far={50}
          shadow-camera-top={50}
          shadow-camera-right={50}
          shadow-camera-bottom={-50}
          shadow-camera-left={-50}
        />
        <ambientLight intensity={0.5} />

        <ambientLight intensity={1} />

        <Physics>
          {players && mainPlayerUid && <Player players={players} mainPlayerId={mainPlayerUid} />}
          <MainPlayer key={mainPlayerUid} uid={mainPlayerUid} />
          <Ground />

          <RigidBody type='fixed'>
            <CuboidCollider
              args={[3, 2, 3]}
              position={[-8, 0, 0]}
              sensor
              onIntersectionEnter={() => setIsReadyLong(true)}
              onIntersectionExit={() => {
                setIsReadyLong(false)
                setShowAmount(false)
                setCurrentPosition(undefined)
              }}
            />
            <Arrow position={[-8, 0, 0]} color='green' />
          </RigidBody>

          <RigidBody type='fixed'>
            <CuboidCollider
              args={[3, 2, 3]}
              sensor
              position={[8, 0, 0]}
              onIntersectionEnter={() => setIsReadyShort(true)}
              onIntersectionExit={() => {
                setIsReadyShort(false)
                setShowAmount(false)
                setCurrentPosition(undefined)
              }}
            />
            <Arrow position={[8, 0, 0]} rotation={[0, 0, Math.PI]} color='red' />
          </RigidBody>
        </Physics>
      </Canvas>
      <Loader />

      <Hint isShow={isReadyLong}>
        Press <kbd className='kbd'>Space</kbd> to place LONG position
      </Hint>

      <Hint isShow={isReadyShort}>
        Press <kbd className='kbd'>Space</kbd> to place SHORT position
      </Hint>

      <AmountOption isShow={showAmount} isLoading={placingPosition} choosenAmount={choosenAmount} />
    </>
  )
}

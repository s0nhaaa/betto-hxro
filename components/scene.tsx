import Ground from '@/components/ground'
import MainPlayer from '@/components/main-player'
import Player from '@/components/player'
import { auth, database } from '@/configs/firebase'
import usePlayerWallet from '@/hooks/usePlayerWalletAddress'
import { Players } from '@/types/player'
import { Loader } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { onValue, ref, remove, set } from 'firebase/database'
import { useEffect, useState } from 'react'

export default function Scene() {
  const [mainPlayerUid, setMainPlayerUid] = useState('')
  const [players, setPlayers] = useState<Players>()
  const [isSignIn, setIsSignIn] = useState(false)
  const playerWallet = usePlayerWallet((state) => state.wallet)

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

    playerWallet &&
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid
          setMainPlayerUid(uid)
          await set(ref(database, `players/${uid}`), {
            id: uid,
            walletAddress: playerWallet,
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
        } else {
          remove(ref(database, `players/${mainPlayerUid}`))
        }
      })

    window.addEventListener('beforeunload', () => {
      remove(ref(database, `players/${mainPlayerUid}`))
    })

    return () => {
      remove(ref(database, `players/${mainPlayerUid}`))
    }
  }, [mainPlayerUid, playerWallet])

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

    onValue(ref(database, 'players'), (snapshot) => {
      console.log(snapshot.val())
      setPlayers(snapshot.val())
    })
  }, [isSignIn])

  return (
    <>
      <Canvas className='h-full w-full'>
        <mesh>
          <boxGeometry />
          <meshNormalMaterial />
        </mesh>

        <ambientLight intensity={1} />

        <Physics debug>
          {players && mainPlayerUid && <Player players={players} mainPlayerId={mainPlayerUid} />}
          <MainPlayer uid={mainPlayerUid} />
          <Ground />
        </Physics>
      </Canvas>
      <Loader />
    </>
  )
}

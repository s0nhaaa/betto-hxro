import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { useGLTF, Text } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { RigidBody } from '@react-three/rapier'
import useMasterWallet from '@/hooks/useMasterWallet'
import { Keypair, PublicKey } from '@solana/web3.js'
import { decode } from 'bs58'
import { useEffect, useMemo } from 'react'
import {
  DEVNET_CONFIG,
  MarketPairEnum,
  Parimutuel,
  ParimutuelWeb3,
  calculateNetOdd,
  getMarketPubkeys,
} from '@hxronetwork/parimutuelsdk'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import BN from 'bn.js'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder001: THREE.Mesh
    Cube: THREE.Mesh
    Cube001: THREE.Mesh
  }
  materials: {}
}

interface PariObj {
  longPool: any // This is how much money is in the Long Pool of the contest
  shortPool: any // This is how much money is in the Short Pool of the contest
  longOdds: string // This is the weighted odds of the Long Pool
  shortOdds: string // This is the weighted odds of the Short Pool
  pubkey: string // This is the contest pubkey
}

export default function Board({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF('/board.glb') as GLTFResult

  // const [keypair, setKeyair] = useMasterWallet((state) => [state.keypair, state.setKeyair])
  // const { connection } = useConnection()
  // const parimutuelWeb3 = useMemo(() => new ParimutuelWeb3(DEVNET_CONFIG, connection), [connection])
  // const marketPubkey = getMarketPubkeys(DEVNET_CONFIG, MarketPairEnum.SOLUSD)
  // const { publicKey } = useWallet()
  // const [countDownTime, setCountDownTime] = useState<string>('')
  // const [pariObj, setPariObj] = useState<PariObj>()

  // useEffect(() => {
  //   setKeyair(Keypair.fromSecretKey(decode(process.env.NEXT_PUBLIC_MASTER_WALLET_PRIVATE_KEY as string)))
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <RigidBody type='fixed' position={[0, -1.5, -20]}>
      <group ref={group} {...props} dispose={null} scale={2}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001.geometry}
          position={[3.08, 2.66, 0]}
          scale={[0.2, 2.7, 0.2]}>
          <meshStandardMaterial color={'lightpink'} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Cube.geometry} position={[0, 3.52, 0]} scale={[3.07, 1.7, 0.2]}>
          <meshStandardMaterial color={'lightsteelblue'} />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube001.geometry}
          position={[0, 3.52, 0]}
          scale={[3.07, 1.7, 0.2]}>
          <meshStandardMaterial color={'lightsteelblue'} />
        </mesh>
      </group>
    </RigidBody>
  )
}

useGLTF.preload('/board.glb')

import { RigidBody } from '@react-three/rapier'
import React, { useRef } from 'react'

export default function Ground() {
  return (
    <RigidBody type='fixed'>
      <mesh position={[0, -2, 0]} receiveShadow>
        <boxGeometry args={[300, 1, 300]} />
        <meshStandardMaterial color='lightblue' />
      </mesh>
    </RigidBody>
  )
}

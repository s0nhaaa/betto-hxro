import { RigidBody } from '@react-three/rapier'
import React, { useRef } from 'react'

export default function Ground() {
  return (
    <RigidBody type='fixed'>
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[100, 1, 100]} />
        <meshStandardMaterial color={'red'} />
      </mesh>
    </RigidBody>
  )
}

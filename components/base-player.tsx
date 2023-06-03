import React from 'react'

export default function BasePlayer() {
  return (
    <mesh>
      <boxGeometry args={[2, 4, 2]} />
      <meshNormalMaterial />
    </mesh>
  )
}

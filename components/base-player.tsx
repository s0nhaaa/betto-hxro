export default function BasePlayer() {
  return (
    <group>
      <mesh castShadow>
        <capsuleGeometry args={[1, 2]} />
        <meshStandardMaterial color='mediumpurple' />
      </mesh>
      <mesh castShadow position={[0, 1.5, 0.5]}>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color='mediumpurple' />
      </mesh>
    </group>
  )
}

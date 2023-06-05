type BasePlayerProps = {
  color: string
}

export default function BasePlayer(props: BasePlayerProps) {
  return (
    <group>
      <mesh castShadow>
        <capsuleGeometry args={[1, 2]} />
        <meshStandardMaterial color={props.color} />
      </mesh>
      <mesh castShadow position={[0, 1.5, 0.5]}>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color={props.color} />
      </mesh>
    </group>
  )
}

import { Edges, useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh
  }
  materials: {}
}

export default function Arrow({ color, ...props }: JSX.IntrinsicElements['group'] & { color: 'red' | 'green' }) {
  const { nodes } = useGLTF('/cursor.glb') as GLTFResult

  return (
    <group {...props}>
      <mesh castShadow scale={[0.5, 1, 0.55]} rotation={[0, Math.PI / 2, 0]} geometry={nodes.Cube.geometry}>
        <meshStandardMaterial color={color} />
        <Edges scale={1.003} color='white' />
      </mesh>
    </group>
  )
}

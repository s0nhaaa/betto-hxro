import { OFFSET } from '@/configs/app'
import { database } from '@/configs/firebase'
import { useControls } from '@/hooks/useControls'
import { directionOffset } from '@/utils/direction-offset'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RapierRigidBody, RigidBody } from '@react-three/rapier'
import { ref, set } from 'firebase/database'
import { useRef } from 'react'
import { Group, Quaternion, Vector3 } from 'three'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import BasePlayer from './base-player'

const walkDirection = new Vector3()
const rotateAngle = new Vector3(0, 1, 0)
const rotateQuaternion = new Quaternion()
const cameraTarget = new Vector3()

const SPEED = 15
const direction = new Vector3()
const frontVector = new Vector3()
const sideVector = new Vector3()

type MainPlayerProps = {
  uid: string
}

export default function MainPlayer(props: MainPlayerProps) {
  const playerRef = useRef<Group>(null)
  const orbitControlRef = useRef<OrbitControlsImpl>(null)
  const rigidBodyRef = useRef<RapierRigidBody>(null)

  const { forward, backward, left, right } = useControls()

  const frameCount = useRef(0)

  useFrame(({ camera }) => {
    if (!rigidBodyRef.current || !playerRef.current || !orbitControlRef.current) return

    frameCount.current += 1
    const velocity = rigidBodyRef.current.linvel()

    if (forward || backward || left || right) {
      let angleYCameraDirection = Math.atan2(
        camera.position.x - playerRef.current.position.x,
        camera.position.z - playerRef.current.position.z,
      )
      let dO = directionOffset({ forward, backward, left, right })
      rotateQuaternion.setFromAxisAngle(rotateAngle, angleYCameraDirection + dO)
      playerRef.current.quaternion.rotateTowards(rotateQuaternion, 0.2)
      camera.getWorldDirection(walkDirection)
      walkDirection.y = 0
      walkDirection.normalize()
      walkDirection.applyAxisAngle(rotateAngle, dO)

      if (frameCount.current % OFFSET === 0) {
        set(ref(database, `players/${props.uid}`), {
          id: props.uid,
          position: {
            x: playerRef.current.position.x,
            y: playerRef.current.position.y,
            z: playerRef.current.position.z,
          },
          quaternion: {
            x: playerRef.current.quaternion.x,
            y: playerRef.current.quaternion.y,
            z: playerRef.current.quaternion.z,
            w: playerRef.current.quaternion.w,
          },
        })
      }
    }

    frontVector.set(0, 0, Number(backward) - Number(forward))
    sideVector.set(Number(left) - Number(right), 0, 0)
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation)
    rigidBodyRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true)

    const translation = rigidBodyRef.current.translation()
    let cameraPositionOffset = camera.position.sub(playerRef.current.position)

    playerRef.current.position.x = translation.x
    playerRef.current.position.y = 0
    playerRef.current.position.z = translation.z

    cameraTarget.set(translation.x, translation.y, translation.z)

    orbitControlRef.current.target = cameraTarget

    camera.position.z = translation.z + cameraPositionOffset.z
    camera.position.x = translation.x + cameraPositionOffset.x
    camera.updateProjectionMatrix()
  })

  return (
    <>
      <OrbitControls
        ref={orbitControlRef}
        enableZoom={false}
        enablePan={true}
        enableDamping={true}
        maxDistance={17}
        minDistance={17}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minPolarAngle={Math.PI / 4}
      />
      <PerspectiveCamera makeDefault near={0.1} far={300} position={[17, 6, 17]} />
      <group name='player'>
        <RigidBody
          ref={rigidBodyRef}
          type='dynamic'
          position={[0, 1, 0]}
          colliders={false}
          enabledRotations={[false, false, false]}>
          <CuboidCollider args={[1.5, 4, 1.5]} />
        </RigidBody>

        <group ref={playerRef}>
          <BasePlayer />
        </group>
      </group>
    </>
  )
}

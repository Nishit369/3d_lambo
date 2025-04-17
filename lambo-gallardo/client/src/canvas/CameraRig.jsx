import { PerspectiveCamera } from '@react-three/drei'
import cameraRef from './CameraRef'

export default function CameraRig() {
  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[55, 20, 20]}
      rotation={[0, Math.PI, 0]}
      fov={80}
    />
  )
}
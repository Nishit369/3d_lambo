import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, MeshReflectorMaterial, Lightformer } from '@react-three/drei'
import Beast from './Beast'
import { useSnapshot } from 'valtio'
import state from '../store'
import * as THREE from 'three'

function BeastWrapper({ intro }) {
  const ref = useRef()
  const targetY = intro ? Math.PI / 1.75 : Math.PI / 100

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetY, 0.05)
    }
  })

  return (
    <group ref={ref} scale={15} position={[0, -1.162, 0]}>
      <Beast />
    </group>
  )
}

const Backdrop = () => {
  const snap = useSnapshot(state)

  return (
    <>
      <color attach="background" args={['#15151a']} />
      <BeastWrapper intro={snap.intro} />
      {/* <hemisphereLight intensity={0.5} /> */}
      <ContactShadows
        resolution={1024}
        frames={1}
        position={[0, -1.162, 0]}
        scale={15}
        blur={2}
        opacity={0.7}
        far={20}
      />
      <mesh position={[0, -1.162, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <MeshReflectorMaterial
  blur={[500, 100]} 
  resolution={1024} 
  mixBlur={1}
  mixStrength={15}
  roughness={0.1}
  depthScale={1.2}
  minDepthThreshold={0.4}
  maxDepthThreshold={1.4}
  color="#1a1a1a"
  metalness={0.8}
  mirror={1}
/>
      </mesh>
      <Environment resolution={512}>
        <Lightformer intensity={5} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 1, 1]} />
        <Lightformer intensity={5} rotation-x={Math.PI / 2} position={[0, 5, -6]} scale={[10, 1, 1]} />
        <Lightformer intensity={5} rotation-x={Math.PI / 2} position={[0, 5, -3]} scale={[10, 1, 1]} />
        <Lightformer intensity={5} rotation-x={Math.PI / 2} position={[0, 5, 0]} scale={[10, 1, 1]} />
        <Lightformer intensity={5} rotation-x={Math.PI / 2} position={[0, 5, 3]} scale={[10, 1, 1]} />
        <Lightformer intensity={5} rotation-x={Math.PI / 2} position={[0, 5, 6]} scale={[10, 1, 1]} />
        <Lightformer intensity={5} rotation-x={Math.PI / 2} position={[0, 5, 9]} scale={[10, 1, 1]} />
        {/* <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} /> */}
        {/* <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} /> */}
        <Lightformer
          form="ring"
          color="red"
          intensity={10}
          scale={5}
          position={[10, 5, 10]}
          onUpdate={(self) => self.lookAt(0, 0, 0)}
        />
      </Environment>
    </>
  )
}

export default function App() {
  return <Backdrop />
}
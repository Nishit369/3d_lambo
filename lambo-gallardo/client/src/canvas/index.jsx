import React, { Suspense, useState } from 'react'
import { Canvas} from '@react-three/fiber'
import {  Loader} from '@react-three/drei'
import Backdrop from './Backdrop'
import { OrbitControls } from '@react-three/drei'
import state from '../store'
import { Effects } from './Effects'
import CameraRig from './CameraRig'
import { Perf } from 'r3f-perf'
import { useSnapshot } from 'valtio'

const Model  = () => {
  const snap = useSnapshot(state);
  return (
    <Suspense fallback={<Loader/>}>
    <Canvas
    gl={{ preserveDrawingBuffer:true,logarithmicDepthBuffer: true, antialias: false }} dpr={[1, 1.5]} camera={{ position: [0, 0, 15], fov: 25 }} >
      
{/* <Perf position='top-left' /> */}
        <Backdrop/>
        <ambientLight intensity={1}/>
        <Effects />
       
  

        <CameraRig/>
       
        <OrbitControls enableDamping
  dampingFactor={0.08} 
  rotateSpeed={0.7}    enableZoom={false} enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.25} minDistance={1} maxDistance={100} /> 


      
        
    </Canvas>
    </Suspense>
  )
}

export default Model
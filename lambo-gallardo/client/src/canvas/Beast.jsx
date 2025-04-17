import React, { useState, useEffect, useRef } from 'react'
import {easing} from 'maath'
import { useSnapshot } from 'valtio'
import { useFrame } from '@react-three/fiber'
import {Decal, useGLTF, useTexture, Text, useScroll} from '@react-three/drei'
import state from '../store'
import { useMemo } from 'react';
import * as THREE from 'three';

const fontPromise = (function() {
  // Return a promise that resolves when the font is loaded
  return new Promise((resolve, reject) => {
    const fontFace = new FontFace('CustomFont', 'url(/font.ttf)');
    
    fontFace.load().then(font => {
      document.fonts.add(font);
      resolve(true);
    }).catch(err => {
      console.error('Could not load the font:', err);
      reject(err);
    });
  });
})();

fontPromise.catch(err => console.error('Font preloading failed:', err));


const Beast = (props) => {
  const snap = useSnapshot(state);
  const {nodes, materials} = useGLTF('/red_beast.glb');
  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);
  const glass = materials.glass_trans;
  const doorRef = useRef();
  const group = useRef();

  
  // Store original positions for all meshes
  
 
    
    

  // Fixed animation frame with proper null checks
  
    
        
       
  
  const textTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.font = 'bold 30px CustomFont';
    context.fillStyle = 'red'; 
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(snap.text || "", canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, [snap.text]); 
  
  useFrame((state, delta) => {
    // Main car body color
    easing.dampC(materials.paint.color, snap.color, 0.25, delta);
    
    // Door color - this is the key fix
   
      easing.dampC(doorRef.current.material.color, snap.doorColor , 0.25, delta);
    
    
    // Rim color
    easing.dampC(materials.material.color, snap.rimColor , 0.25, delta);
    
    // Glass lens color (headlights)
    easing.dampC(materials.glass_lens.color, snap.isHeadlightOn ? "#ffffff" : "#000000", 0.25, delta);
  });
  
  useEffect(() => {
    // Set up materials
    materials.Chrome.color.set("red");
    materials.chrome_light_reflective.color.set("yellow");
    
    // Set up door material
    // if (doorRef.current) {
    //   // Create a new material instance for the door to prevent affecting other parts
    //   doorRef.current.material = materials.paint.clone();
    //   doorRef.current.material.color.set(snap.doorColor || snap.color);
    // }
    
    // Set up glass properties
    glass.transparent = true;
    glass.opacity = 0.3;
    
    // Handle headlights
    if (snap.isHeadlightOn) {
      glass.color.set("#c9d8ff");
      materials.headlight_plastic.color.set("#c9d8ff");
    } else {
      glass.color.set("#000000");
      materials.headlight_plastic.color.set("#000000");
    }
    
    // Set rim color
    materials.material.color.set(snap.rimColor || "black");
  }, [snap.isHeadlightOn, snap.rimColor, materials.paint]);

  const stateString = JSON.stringify(snap);

  return (
    <>
      <group {...props} dispose={null} ref={group}>
        <group rotation={[-Math.PI / 2, 0, Math.PI/6]} scale={0.015} >
          < group rotation={[Math.PI / 2, 0, 0]} key={stateString} >
            <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_spoiler001_plastic_black_0.geometry}
                material={materials.plastic_black}
              >
              </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_spoiler001_metal_black_0.geometry}
                material={materials.metal_black}
              />
            </group>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_light_inner_headlight_plastic_0.geometry}
                material={materials.headlight_plastic}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_light_inner_chrome_light_reflective_0.geometry}
                material={materials.chrome_light_reflective}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_light_inner_Chrome_0.geometry}
                material={materials.Chrome}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_light_inner_emission_1_0.geometry}
                material={materials.emission_1}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_light_inner_glass_lens_0.geometry}
                material={materials.glass_lens}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_light_inner_glass_trans_0.geometry}
                material={materials.glass_trans}
              />
            </group>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_bumper_repeater_glass_chrome_light_reflective_0.geometry}
                material={materials.chrome_light_reflective}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_bumper_repeater_glass_Chrome_0.geometry}
                material={materials.Chrome}
              />
            </group>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_spoiler_light_inner_chrome_light_reflective_0.geometry}
                material={materials.chrome_light_reflective}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_spoiler_light_inner_Chrome_0.geometry}
                material={materials.Chrome}
              />
            </group>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_bumper_light_inner_chrome_light_reflective_0.geometry}
                material={materials.chrome_light_reflective}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_bumper_light_inner_Chrome_0.geometry}
                material={materials.Chrome}
              />
            </group>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_light_inner_light_inner_back_0.geometry}
                material={materials.light_inner_back}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_light_inner_chrome_light_reflective_0.geometry}
                material={materials.chrome_light_reflective}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_light_inner_Chrome_0.geometry}
                material={materials.Chrome}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_light_inner_light_glow_back_0.geometry}
                material={materials.light_glow_back}
              />
            </group>
          
              <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <mesh
  castShadow
  receiveShadow
  geometry={nodes.f_bumper009_grid_back_0.geometry}
  material={materials.grid_back}
>
  {textTexture && (
    <Decal
      position={[0, 2.5, 0.63]}
      rotation={[Math.PI/2, Math.PI, 0]}
      scale={[2, 0.5, 1]}
      polygonOffset
      polygonOffsetFactor={-1}
    >
      <meshStandardMaterial
        map={textTexture}
        transparent={true}
        alphaTest={0.7}
        depthWrite={false}
        depthTest={true}
        polygonOffset
        polygonOffsetFactor={-10}
        color="white" 
      />
    </Decal>
  )}
</mesh>
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.f_bumper009_grid_0.geometry}
                  material={materials.grid}
                />
              </group>
              <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.b_exhaust_Chrome_0.geometry}
                  material={materials.Chrome}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.b_exhaust_Chrome_exhaust_inner_0.geometry}
                  material={materials.Chrome_exhaust_inner}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.b_exhaust_black_0.geometry}
                  material={materials.black}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.b_exhaust_exhaust_grid_0.geometry}
                  material={materials.exhaust_grid}
                />
              </group>
              <group position={[60.784, 70.067, 130.189]} rotation={[-1.595, 0.009, 0.487]} scale={100}>
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.wiper_l_metal_black_0.geometry}
                  material={materials.metal_black}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.wiper_l_plastic_black_0.geometry}
                  material={materials.plastic_black}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.wiper_l_rubber_0.geometry}
                  material={materials.rubber}
                />
              </group>
              <group position={[-4.6, 70.067, 144.758]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.wiper_r_metal_black_0.geometry}
                  material={materials.metal_black}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.wiper_r_plastic_black_0.geometry}
                  material={materials.plastic_black}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.wiper_r_rubber_0.geometry}
                  material={materials.rubber}
                />
              </group>
              <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.interior_interior_0.geometry}
                  material={materials.interior}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.interior_dashbard_0.geometry}
                  material={materials.dashbard}
                />
              </group>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_bumper_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_fender_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.s_skirt_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_bumper_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
              
                castShadow
                receiveShadow
                geometry={nodes.s_door_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >

       
                                 
                </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_vent_cover_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_engine_cover_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_trunk_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                {snap.isFullTexture && (
                        <Decal
                            position={[0,-1.75,0.65]}
                            rotation={[0,0,0]}
                            scale={2.75}
                            map={fullTexture}
                        />
                    )}
                    {snap.isLogoTexture && (
                        <Decal
                            position={[0,-1.75,0.65]}
                            rotation={[0,0,0]}
                            map={logoTexture}
                            scale={0.4}
                            
                            
                        />
                    )}
                </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.t_roof_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
              </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.t_roof_detail_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_hood_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                 
                </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_spoiler_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                
                </mesh>
              <mesh
                
                castShadow
                receiveShadow
                geometry={nodes.s_door_handle_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_bumper_splitter_paint_sec_0.geometry}
                material={materials.paint_sec}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                
                </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.s_mirror_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.s_mirror_miror_mirror_0.geometry}
                material={materials.mirror}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.t_roof_top_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                {snap.isFullTexture && (
                        <Decal
                            position={[0.15,0,1.2]}
                            rotation={[0,0,0]}
                            scale={3}
                            map={fullTexture}
                        />
                    )}
                    {snap.isLogoTexture && (
                        <Decal
                            position={[0,0.15,1.2]}
                            rotation={[0,0,0]}
                            scale={1}
                            map={logoTexture}
                            depthTest={false}
                            depthWrite={true}
                            
                            
                        />
                    )}
                </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_fender_paint_0.geometry}
                material={materials.paint}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_window_glass_0.geometry}
                material={materials.glass}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}  
              >
                </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_window_trim_rubber_0.geometry}
                material={materials.rubber}
                position={[0, 0.102, -0.213]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_window_glass_0.geometry}
                material={materials.glass}
                position={[0, 0.122, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_window_trim_rubber_0.geometry}
                material={materials.rubber}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.s_fender_window_glass_0.geometry}
                material={materials.glass}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.s_door_window_glass_0.geometry}
                material={materials.glass}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_fender_window_glass_0.geometry}
                material={materials.glass}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
              ref={doorRef}
                castShadow
                receiveShadow
                geometry={nodes.s_door_window_detail_1_plastic_black_0.geometry}
                material={materials.plastic_black}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.s_door_window_detail_2_plastic_black_0.geometry}
                material={materials.plastic_black}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.s_window_trim_rubber_0.geometry}
                material={materials.rubber}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.s_door_window_trim_rubber_0.geometry}
                material={materials.rubber}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_engine_cover_window_glass_engine_0.geometry}
                material={materials.glass}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_light_glass_glass_red_0.geometry}
                material={materials.glass_red}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_light_glass_glass_trans_0.geometry}
                material={materials.glass_trans}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_light_cleaner_paint_sec_0.geometry}
                material={materials.paint_sec}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_bumper_repeater_inner_glass_yellow_0.geometry}
                material={materials.glass_yellow}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_spoiler_light_glass_glass_red_0.geometry}
                material={materials.glass_red}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_bumper_light_glass_glass_red_0.geometry}
                material={materials.glass_red}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_engine_cover_detail_plastic_black_0.geometry}
                material={materials.plastic_black}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_bumper_grid_1_trim_plastic_black_0.geometry}
                material={materials.plastic_black}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_bumper_grid_2_trim_plastic_black_0.geometry}
                material={materials.plastic_black}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_bumper_grid_trim_plastic_black_0.geometry}
                material={materials.plastic_black}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_fender_grid_trim_plastic_black_0.geometry}
                material={materials.plastic_black}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_window_drain_plastic_black_0.geometry}
                material={materials.plastic_black}
                position={[0, 0.122, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_lambo_logo_Chrome_0.geometry}
                material={materials.Chrome}
                rotation={[Math.PI, 0, Math.PI]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.f_bull_logo_bull_logo_0.geometry}
                material={materials.bull_logo}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_engine_engine_0.geometry}
                material={materials.engine}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.b_bumper_down_plastic_black_0.geometry}
                material={materials.plastic_black}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.bottom_black_0.geometry}
                material={materials.black}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.tire_l_tire_0.geometry}
                material={materials.tire}
                position={[80.422, 32.182, 110.253]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.bolts_Chrome_0.geometry}
                material={materials.Chrome}
                position={[92.138, 32.194, 110.253]}
                rotation={[-Math.PI / 2, -Math.PI / 2, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.rim_l_Rim_0.geometry}
                material={materials.material}
                position={[92.138, 32.194, 110.253]}
                rotation={[-Math.PI / 2, Math.PI / 2, 0]}
                scale={100}
              >
                
                </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.brake_disk_brake_disk_0.geometry}
                material={materials.brake_disk}
                position={[92.138, 32.194, 110.253]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.caliper_caliper_0.geometry}
                material={materials.caliper}
                position={[92.138, 32.194, 110.253]}
                rotation={[-2.737, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.axis_Chrome_exhaust_inner_0.geometry}
                material={materials.Chrome_exhaust_inner}
                position={[92.138, 32.194, 110.253]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.wheel_bull_logo_bull_logo_0.geometry}
                material={materials.bull_logo}
                position={[87.863, 32.194, 110.253]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.tire_l001_tire_0.geometry}
                material={materials.tire}
                position={[80.988, 32.182, -144.294]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.rim_l001_Rim_0.geometry}
                material={materials.material}
                position={[92.704, 32.194, -144.294]}
                rotation={[-Math.PI / 2, Math.PI / 2, 0]}
                scale={100}
              >
                
              </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.brake_disk001_brake_disk_0.geometry}
                material={materials.brake_disk}
                position={[92.704, 32.194, -144.294]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.caliper001_caliper_0.geometry}
                material={materials.caliper}
                position={[92.704, 32.194, -144.294]}
                rotation={[-2.737, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.axis001_Chrome_exhaust_inner_0.geometry}
                material={materials.Chrome_exhaust_inner}
                position={[92.704, 32.194, -144.294]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.wheel_bull_logo001_bull_logo_0.geometry}
                material={materials.bull_logo}
                position={[88.429, 32.194, -144.294]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.bolts002_Chrome_0.geometry}
                material={materials.Chrome}
                position={[92.704, 32.194, -144.294]}
                rotation={[-Math.PI / 2, -Math.PI / 2, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.tire_l002_tire_0.geometry}
                material={materials.tire}
                position={[-80.422, 32.182, 110.253]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.bolts001_Chrome_0.geometry}
                material={materials.Chrome}
                position={[-92.138, 32.194, 110.253]}
                rotation={[Math.PI / 2, -Math.PI / 2, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.rim_l002_Rim_0.geometry}
                material={materials.material}
                position={[-92.138, 32.194, 110.253]}
                rotation={[-Math.PI / 2, Math.PI / 2, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.brake_disk002_brake_disk_0.geometry}
                material={materials.brake_disk}
                position={[-92.138, 32.194, 110.253]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.caliper002_caliper_0.geometry}
                material={materials.caliper}
                position={[-92.138, 32.194, 110.253]}
                rotation={[0.405, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.axis002_Chrome_exhaust_inner_0.geometry}
                material={materials.Chrome_exhaust_inner}
                position={[-92.138, 32.194, 110.253]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.wheel_bull_logo002_bull_logo_0.geometry}
                material={materials.bull_logo}
                position={[-87.863, 32.194, 110.253]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.tire_l003_tire_0.geometry}
                material={materials.tire}
                position={[-80.988, 32.182, -144.294]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.rim_l003_Rim_0.geometry}
                material={materials.material}
                position={[-92.704, 32.194, -144.294]}
                rotation={[-Math.PI / 2, Math.PI / 2, 0]}
                scale={100}
              >
                
                </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.brake_disk003_brake_disk_0.geometry}
                material={materials.brake_disk}
                position={[-92.704, 32.194, -144.294]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.caliper003_caliper_0.geometry}
                material={materials.caliper}
                position={[-92.704, 32.194, -144.294]}
                rotation={[0.405, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.axis003_Chrome_exhaust_inner_0.geometry}
                material={materials.Chrome_exhaust_inner}
                position={[-92.704, 32.194, -144.294]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.wheel_bull_logo003_bull_logo_0.geometry}
                material={materials.bull_logo}
                position={[-88.429, 32.194, -144.294]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={100}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.bolts003_Chrome_0.geometry}
                material={materials.Chrome}
                position={[-92.704, 32.194, -144.294]}
                rotation={[Math.PI / 2, -Math.PI / 2, 0]}
                scale={100}
              />
            </group>
          </group>
          
        </group>
        </>
      )
}

export default Beast





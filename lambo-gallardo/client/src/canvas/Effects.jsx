import { useLoader } from "@react-three/fiber";
import { EffectComposer,  Bloom, LUT } from "@react-three/postprocessing";
import { LUTCubeLoader } from "postprocessing";
import state from "../store";
import { useSnapshot } from "valtio";
export function Effects() {
  const texture = useLoader(LUTCubeLoader, "/cube.cube");
  const snap = useSnapshot(state);
  return (
    (
      <EffectComposer disableNormalPass>
        {snap.fxEnabled ? <>
          <Bloom luminanceThreshold={0.2} mipmapBlur luminanceSmoothing={0} intensity={0.5} />
          <LUT lut={texture}/> 
        </>: 
        null
       }
         
      </EffectComposer>
    )
  );
}
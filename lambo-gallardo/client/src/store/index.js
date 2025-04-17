import { proxy } from 'valtio';

const state = proxy ({
    intro: true,
    color: "#000000",
    doorColor:"#000000",
    rimColor:"#000000",
    exploded:false,
    isLogoTexture: false,
    isFullTexture: false,
    isHeadlightOn : false,
    logoDecal: './threejs.png',
    fullDecal: './threejs.png',
    text:"",
    fxEnabled: false,
    
    
    
});

export default state;
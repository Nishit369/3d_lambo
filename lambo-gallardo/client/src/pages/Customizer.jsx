import React, {useState, useEffect, useRef} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import state from '../store';
import {download} from '../assets'
import { rev } from '../assets';
import gsap from "gsap"
import * as THREE from "three";
import { downloadCanvasToImage,reader } from '../config/helpers';
import { EditorTabs, DecalTypes, FilterTabs, DesignTabs } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AiPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';
import { TextInput } from '../components/TextInput';
import Gallery from '../components/Gallery';
import cameraRef from '../canvas/CameraRef';



const Customizer = () => {
    const snap = useSnapshot(state);
    const [file, setFile] = useState('');
    const [prompt, setPrompt] = useState('');
    const [generatingImg, setGeneratingImg] = useState(false);
    const [activeEditorTab, setActiveEditorTab] = useState("");
    const [activeDesignTab, setActiveDesignTab] = useState("");
    const [newTexture, setNewTexture] = useState({});
    const [storedTextures, setStoredTextures] = useState([]);
    const [activeFilterTab, setActiveFilterTab] = useState({
        logoCar: true,
        stylishCar: false
    });
    const audioRef = useRef(new Audio('/sound.mp3'));
    const popupRef = useRef();
    const [effectTitle, setEffectTitle] = useState("Add Effects")
    
    // Fetch stored textures on component mount
    useEffect(() => {
        fetchStoredTextures();
    }, []);

    // Function to fetch stored textures from the server
    const fetchStoredTextures = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/clipdrop/');
            const data = await response.json();
            
            if (data.files && Array.isArray(data.files)) {
                // Map the file paths to texture objects that can be used by the Gallery
                const textures = data.files.map((file, index) => ({
                    _id: `stored-${index}`,
                    image: `http://localhost:8080/temp-textures/${path.basename(file)}`,
                    prompt: `Stored texture ${index + 1}`
                }));
                setStoredTextures(textures);
            }
        } catch (error) {
            console.error("Error fetching stored textures:", error);
        }
    };

    const clickSound = ()=>{
        const audio = new Audio("/click.mp3");
        audio.play();
    }

    const playSound = () => {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
    }

    const hoverSound = () => {
        const audio = new Audio("/hover.mp3");
        audio.play();
      };

    const moveCameraTo = (pos, lookAt) => {
        if (!cameraRef.current) return
        gsap.to(cameraRef.current.position, {
            ...pos,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                cameraRef.current.lookAt(lookAt)
            }
        })
    }

    const generateTabContent = () => {
        switch (activeEditorTab) {
            case "colorpicker":
                return <ColorPicker activeDesignTab={activeDesignTab} activeEditorTab={activeEditorTab} popupRef={popupRef} />
            case "filepicker":
                return <FilePicker
                    file={file}
                    setFile={setFile}
                    readFile={readFile}
                    popupRef={popupRef}
                />
            case "aipicker":
                return <AiPicker
                    prompt={prompt}
                    popupRef={popupRef}
                    setPrompt={setPrompt}
                    generatingImg={generatingImg}
                    handleSubmit={handleSubmit}
                />
            default:
                return null;
        }
    }

    // Generate design tab content
    const generateDesignTabContent = () => {
        switch (activeDesignTab) {
            case "Rims":
                return <ColorPicker activeDesignTab={activeDesignTab} activeEditorTab={activeEditorTab} colorKey="rimColor" popupRef={popupRef} />
            case "Door":
                return <ColorPicker activeDesignTab={activeDesignTab} activeEditorTab={activeEditorTab} colorKey="doorColor" popupRef={popupRef} />
            case "Explode":
                return null;
            case "Text":
                return <TextInput popupRef={popupRef} />
            default:
                return null;
        }
    }

    const handleSubmit = async (type) => {
        if(!prompt) return alert("Please enter prompt");
        
        try {
            setGeneratingImg(true);
            
            // Send the prompt to the server for image generation
            const response = await fetch('http://localhost:8080/api/v1/clipdrop/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt,
                })
            });
            
            const data = await response.json();
            
            if (data && data.file) {
                // Create a texture object with the file path
                const newTextureObj = {
                    _id: Date.now().toString(),
                    image: `http://localhost:8080/${data.file}`, // Create URL to access the file
                    prompt: prompt,
                };
                
                setNewTexture(newTextureObj);
                
                // Apply the texture to the model
                handleDecals(type, newTextureObj.image);
                
                // Refresh the list of stored textures
                fetchStoredTextures();
            } else {
                alert("Image generation failed. Please try again!");
            }
        } catch (error) {
            console.error("Error generating texture:", error);
            alert("Error generating texture. Please try again.");
        } finally {
            setGeneratingImg(false);
            setActiveEditorTab("");
        }
    }

    const handleDecals = (type, result) => {
        const decalType = DecalTypes[type];
        state[decalType.stateProperty] = result;
        if (!activeFilterTab[decalType.filterTab]) {
            handleActiveFilterTab(decalType.filterTab);
        }
    }

    const handleActiveFilterTab = (tabName) => {
        switch (tabName) {
            case "logoCar":
                state.isLogoTexture = !activeFilterTab[tabName];
                break;
            case "stylishCar":
                state.isFullTexture = !activeFilterTab[tabName];
                break;
            case "headlights":
                state.isHeadlightOn = !activeFilterTab[tabName];
                break;
            default:
                state.isLogoTexture = true;
                state.isFullTexture = false;
                state.isHeadlightOn = false;
                break;
        }
        
        setActiveFilterTab((prevState) => {
            return {
                ...prevState,
                [tabName]: !prevState[tabName]
            }
        });
    }

    // Handle active design tab
    const handleActiveDesignTab = (tabName) => {
        state.activeDesignTab = tabName;
        
        switch (tabName) {
            case "Rims":
                moveCameraTo({ x: 60, y: 10, z: 10 }, new THREE.Vector3(0, 5, 0));
                break;
            case "Door":
                moveCameraTo({ x: -30, y: 20, z: -50 }, new THREE.Vector3(0, 5, 0));
                break;
            case "Explode":
                state.exploded = !state.exploded;
                break;
            case "Text":
                if (!state.text) {
                    state.text = "BEAST";
                }
                moveCameraTo({ x: -30, y: 20, z: -50 }, new THREE.Vector3(0, 5, 0));
                break;
        }
    }

    const readFile = (type) => {
        reader(file)
        .then((result) => {
            handleDecals(type, result);
            setActiveEditorTab("");
        });
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if(popupRef.current && !popupRef.current.contains(e.target)) {
                setActiveEditorTab("");
                setActiveDesignTab("");
            }
        }
        
        if (activeEditorTab || activeDesignTab) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activeEditorTab, activeDesignTab]);

    return (
        <AnimatePresence>
            {!snap.intro && (
                <>
                    <motion.div
                        key="custom"
                        className='absolute top-0 left-0 z-10'
                        {...slideAnimation("left")}
                    >
                        <div className='flex items-center min-h-screen'>
                            <div className='editortabs-container tabs'>
                                {EditorTabs.map((tab) => (
                                    <Tab
                                        key={tab.name}
                                        tab={tab}
                                        handleClick={() => {
                                            clickSound();
                                            activeEditorTab !== tab.name
                                              ? setActiveEditorTab(tab.name)
                                              : setActiveEditorTab("");
                                          }}
                                    />
                                ))}
                                {generateTabContent()}
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div
                        key="custom2"
                        className='absolute top-0 left-0 z-10'
                        {...slideAnimation("left")}
                    >
                        <Gallery 
                            handleDecals={handleDecals} 
                            newTexture={newTexture} 
                            storedTextures={storedTextures}
                        />
                    </motion.div>    
                       
                    <motion.div
                        className='absolute z-10 top-5 right-5'
                        {...fadeAnimation}
                    >
                       <CustomButton
                            type="filled"
                            title={effectTitle}
                            handleClick={()=>{effectTitle==="Add Effects" ? setEffectTitle("Remove effects") : setEffectTitle("Add Effects"); state.fxEnabled=!state.fxEnabled}}
                            customStyles = "w-fit px-4 py-2.5 mx-2 font-bold text-sm"
                        />
                        <CustomButton
                            type="filled"
                            title="Go Back"
                            handleClick={() => state.intro = true}
                            customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                        />
                    </motion.div>
                    
                    <motion.div 
                        className='filtertabs-container'
                        {...slideAnimation("up")}
                    >
                        {FilterTabs.map((tab) => (
                            <Tab 
                                key={tab.name}
                                tab={tab}
                                isFilterTab
                                isActiveTab={activeFilterTab[tab.name]}
                                handleClick={() => { clickSound();handleActiveFilterTab(tab.name)}}
                            />
                        ))}
                        <button className='download-btn' onClick={()=>{clickSound(); playSound(); }} onMouseEnter={hoverSound}>
                            <img
                                src={rev}
                                alt='rev_image'
                                className='w-3/5 h-3/5 object-contain'
                            />
                        </button>
                        <button className='download-btn' onClick={()=>{clickSound(); downloadCanvasToImage();}} onMouseEnter={hoverSound}>
                            <img
                                src={download}
                                alt='download_image'
                                className='w-3/5 h-3/5 object-contain'
                            />
                        </button>
                    </motion.div>

                    {/* Design tabs */}
                    <motion.div
                        className='absolute right-0 top-0 z-5'
                        {...slideAnimation("right")}
                    >
                        <div className='flex items-center min-h-screen'>
                            <div className='editortabs-container tabs'>
                                {DesignTabs.map((tab) => (
                                    <Tab
                                        key={tab.name}
                                        tab={tab}
                                        handleClick={() => {
                                            clickSound();
                                            if (activeDesignTab !== tab.name) {
                                                setActiveDesignTab(tab.name);
                                                handleActiveDesignTab(tab.name);
                                            } else {
                                                setActiveDesignTab("");
                                            }
                                        }}
                                    />
                                ))}
                                {generateDesignTabContent()}
                            </div>
                            
                        </div>
                        
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default Customizer;
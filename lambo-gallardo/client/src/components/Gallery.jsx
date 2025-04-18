import React, { useState, useEffect, useRef } from "react";

// Component for selecting textures from dropdown menu
const LamborghiniTextureSelectorWithMenu = ({ textures, isLoading, error, onTextureSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTexture, setSelectedTexture] = useState(null);
  const menuRef = useRef(null);

  const toggleOpen = () => {clickSound(); setIsOpen(!isOpen)};

  const handleTextureSelect = (texture) => {
    setSelectedTexture(texture);
    if (onTextureSelect) onTextureSelect(texture);
    setIsOpen(false);
  };

  const clickSound = () => {
    try {
      const audio = new Audio("/click.mp3");
      audio.play().catch(err => console.log("Audio play error:", err));
    } catch (error) {
      console.error("Error playing click sound:", error);
    }
  };
  
  const hoverSound = () => {
    try {
      const audio = new Audio("/hover.mp3");
      audio.play().catch(err => console.log("Audio play error:", err));
    } catch (error) {
      console.error("Error playing hover sound:", error);
    }
  };

  // Function to construct proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Make sure the path starts with a slash
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    // Return the full URL
    return `https://threed-lambo.onrender.com${normalizedPath}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.texture-menu-button')) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        onMouseEnter={hoverSound} 
        className={`texture-menu-button bg-black text-white rounded-md shadow-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors duration-300 hover:bg-gray-800 ${isOpen ? 'rounded-t-md rounded-b-none' : ''}`}
        >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div ref={menuRef} className="absolute top-full left-0 mt-1 bg-black rounded-md shadow-lg p-4 z-10" style={{ width: "300px" }}>
          <button onClick={toggleOpen} className="absolute top-2 right-2 text-gray-400 hover:text-white focus:outline-none">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 className="text-lg font-bold text-white mb-3 text-center uppercase tracking-wider">Choose Your Finish</h3>
          <div className="overflow-y-auto grid grid-cols-3 gap-2 py-2" style={{ maxHeight: "200px" }}>
            {textures.map((texture) => (
              <button
                key={texture._id}
                onClick={() => handleTextureSelect(texture)}
                className={`group w-20 h-20 rounded-md overflow-hidden shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 ${
                  selectedTexture?._id === texture._id
                    ? 'shadow-xl border-2 border-yellow-500 transform scale-105'
                    : 'hover:shadow-xl group-hover:brightness-110'
                }`}
              >
                <img
                  src={getImageUrl(texture.image)}
                  alt={texture.prompt}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                />
              </button>
            ))}
            {textures.length === 0 && !isLoading && !error && (
              <div className="text-gray-400 text-sm col-span-3 text-center">
                No finishes available. Generate awesome textures using AI.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Gallery component
const Gallery = ({ handleDecals, newTexture, storedTextures = [] }) => {
  const [textures, setTextures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCarTexture, setSelectedCarTexture] = useState(null);

  // Function to construct proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Make sure the path starts with a slash
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    console.log(normalizedPath)
    // Return the full URL
    return `https://threed-lambo.onrender.com${normalizedPath}`;
  };

  // Load stored textures + selected texture from both session storage and server
  useEffect(() => {
    const savedTextures = sessionStorage.getItem("allTextures");
    const savedTexture = sessionStorage.getItem("selectedCarTexture");

    let initialTextures = [];
    if (savedTextures) {
      try {
        initialTextures = JSON.parse(savedTextures);
      } catch (e) {
        console.error("Error parsing saved textures from session storage:", e);
      }
    }

    // Fetch textures from server
    fetchServerTextures(initialTextures);

    if (savedTexture) {
      try {
        const parsed = JSON.parse(savedTexture);
        setSelectedCarTexture(parsed);
      } catch (e) {
        console.error("Error parsing saved texture from session storage:", e);
      }
    }
  }, []);

  // Fetch textures from server
  const fetchServerTextures = async (existingTextures = []) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://threed-lambo.onrender.com/api/v1/clipdrop/');
      const data = await response.json();
      console.log("data",data)
      
      if (data.files && Array.isArray(data.files)) {
        // Map the file paths to texture objects
        const serverTextures = data.files.map((file, index) => {
          return {
            _id: `server-${index}-${Date.now()}`,
            image: file, 
            prompt: `Server texture ${index + 1}`,
            source: 'server'
          };
        });
        
        // Merge with existing textures, avoiding duplicates by image URL
        const allImageUrls = existingTextures.map(t => t.image);
        const uniqueServerTextures = serverTextures.filter(t => !allImageUrls.includes(t.image));
        
        const mergedTextures = [...existingTextures, ...uniqueServerTextures];
        setTextures(mergedTextures);
        
        try {
          sessionStorage.setItem("allTextures", JSON.stringify(mergedTextures));
        } catch (e) {
          console.error("Error saving textures to session storage:", e);
        }
      }
    } catch (error) {
      console.error("Error fetching server textures:", error);
      setError("Failed to load textures from server");
      // Still use existing textures if server fetch fails
      setTextures(existingTextures);
    } finally {
      setIsLoading(false);
    }
  };

  // Process new texture from AI generator
  useEffect(() => {
    if (newTexture && Object.keys(newTexture).length > 0) {
      addNewTexture(newTexture);
    }
  }, [newTexture]);

  // Process server-side stored textures
  useEffect(() => {
    if (storedTextures && storedTextures.length > 0) {
      const currentTextures = [...textures];
      let updated = false;
      
      storedTextures.forEach(serverTexture => {
        // Check if texture already exists in our list
        if (!currentTextures.some(t => t.image === serverTexture.image)) {
          currentTextures.push({
            ...serverTexture,
            source: 'server'
          });
          updated = true;
        }
      });
      
      if (updated) {
        setTextures(currentTextures);
        try {
          sessionStorage.setItem("allTextures", JSON.stringify(currentTextures));
        } catch (e) {
          console.error("Error saving textures to session storage:", e);
        }
      }
    }
  }, [storedTextures]);

  const handleTextureSelect = (texture) => {
    if (
      !texture ||
      typeof texture !== 'object' ||
      !texture.image ||
      Object.keys(texture).length === 0
    ) {
      console.warn("Invalid texture selected:", texture);
      return;
    }
  
    setSelectedCarTexture(texture);
    try {
      sessionStorage.setItem("selectedCarTexture", JSON.stringify(texture));
    } catch (e) {
      console.error("Error saving selected texture to session storage:", e);
    }
    
    // Full URL for the decal
    console.log("text",texture.image)
    const fullImageUrl = getImageUrl(texture.image);
    handleDecals("full", fullImageUrl);
  };

  // Add newly generated texture
  const addNewTexture = (newTexture) => {
    if (
      !newTexture ||
      typeof newTexture !== 'object' ||
      !newTexture.image
    ) {
      console.warn("Invalid texture, skipping:", newTexture);
      return;
    }
    
    // Check if the texture already exists
    if (!textures.some(t => t.image === newTexture.image)) {
      const updatedTextures = [...textures, newTexture];
      setTextures(updatedTextures);
      try {
        sessionStorage.setItem("allTextures", JSON.stringify(updatedTextures));
      } catch (e) {
        console.error("Error saving textures to session storage:", e);
      }
      
      // Auto-select the new texture
      setSelectedCarTexture(newTexture);
      try {
        sessionStorage.setItem("selectedCarTexture", JSON.stringify(newTexture));
      } catch (e) {
        console.error("Error saving selected texture to session storage:", e);
      }
      
      // Full URL for the decal
      const fullImageUrl = getImageUrl(newTexture.image);
      handleDecals("full", fullImageUrl);
    }
  };

  return (
    <div className="gallery-container p-4 rounded-md shadow-lg">
      {selectedCarTexture && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-400">Selected Finish:</h4>
          <img
            src={getImageUrl(selectedCarTexture.image)}
            alt={selectedCarTexture.prompt}
            className="w-32 h-32 object-cover rounded-md shadow-md"
          />
          <p className="text-sm text-white mt-1">{selectedCarTexture.prompt}</p>
        </div>
      )}

      {/* Texture Menu */}
      <LamborghiniTextureSelectorWithMenu
        textures={textures}
        isLoading={isLoading}
        error={error}
        onTextureSelect={handleTextureSelect}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-gray-400 text-sm mt-2">
          Loading textures...
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="text-red-400 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default Gallery;
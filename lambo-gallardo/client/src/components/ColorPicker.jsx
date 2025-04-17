import React from 'react';
import {SketchPicker} from 'react-color';
import { useSnapshot } from 'valtio';
import state from '../store';

const ColorPicker = ({popupRef, colorKey = "color", activeDesignTab, activeEditorTab}) => {
  const snap = useSnapshot(state);
  
  // Determine which color state to use based on active tabs
  const getColorState = () => {
    if (activeDesignTab === "Door") return snap.doorColor;
    if (activeDesignTab === "Rims") return snap.rimColor;
    return snap[colorKey] || snap.color;
  };
  
  // Determine which state property to update
  const handleColorChange = (color) => {
    if (activeDesignTab === "Door") {
      state.doorColor = color.hex;
    } else if (activeDesignTab === "Rims") {
      state.rimColor = color.hex;
    } else {
      state[colorKey || "color"] = color.hex;
    }
  };

  return (
    <div
      ref={popupRef}
      className={`absolute z-50 bg-transparent p-2 shadow-lg rounded 
        ${activeDesignTab ? 'right-full mr-3' : ''}
        ${activeEditorTab ? 'left-full ml-3' : ''}
      `}
    >
      <SketchPicker
        color={getColorState()}
        disableAlpha
        onChange={handleColorChange}
      />
    </div>
  );
};

export default ColorPicker;
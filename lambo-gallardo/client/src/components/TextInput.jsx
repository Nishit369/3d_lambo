import { useSnapshot } from "valtio";
import state from "../store";
import { useState } from "react";

export const TextInput = ({ popupRef }) => {
    const snap = useSnapshot(state);
    const [inputText, setInputText] = useState(snap.text || "");
    
    const handleTextChange = (e) => {
      setInputText(e.target.value);
      state.text = e.target.value;
    };
    
    return (
        <div
        ref={popupRef}
        className={`absolute z-50 bg-gray-100 p-4 shadow-lg rounded-lg right-full mr-3 w-64`}
      >
        <h4 className="font-bold text-gray-800 font-mono mb-2">Enter Text</h4>
        <input 
          type="text" 
          placeholder="Enter text for bumper"
          value={inputText}
          onChange={handleTextChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 text-sm"
          maxLength="12" 
        />
      </div>
    );
  };
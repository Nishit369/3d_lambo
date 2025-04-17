import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import state from '../store';

const Tab = ({ tab, isFilterTab, isActiveTab, handleClick }) => {
  const snap = useSnapshot(state);
  const [hovered, setHovered] = useState(false);

  const hoverSound = () => {
    const audio = new Audio("/hover.mp3");
    audio.play();
  };

  const baseStyles = isFilterTab
    ? 'rounded-full glassmorphism'
    : 'rounded-lg px-1 my-2 ';

  const hoverStyles = hovered
    ? 'scale-125 shadow-xl'
    : '';

  const activeBackground = isFilterTab && isActiveTab
    ? snap.color
    : hovered
      ? '#aaa'
      : 'transparent';

  return (
    <div
      key={tab.name}
      className={`tab-btn ${baseStyles} ${hoverStyles} transition-all duration-200 ease-in-out cursor-pointer`}
      onClick={handleClick}
      onMouseEnter={() => {
        setHovered(true);
        hoverSound();
      }}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: activeBackground,
        opacity: hovered || (isFilterTab && isActiveTab) ? 0.9 : 1
      }}
    >
      <img
        src={tab.icon}
        alt={tab.name}
        className={`${isFilterTab ? 'w-5/6 h-5/6' : 'w-11/12 h-11/12'} pointer-events-none`}
      />
     
    </div>
  );
};

export default Tab;

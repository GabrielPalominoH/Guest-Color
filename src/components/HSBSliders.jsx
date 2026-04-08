import React from 'react';
import './HSBSliders.css';
import { hsbToHslString } from '../utils/colorUtils';

const HSBSliders = ({ color, onChange, onInteractStart, onInteractEnd }) => {
  const handleChange = (field, value) => {
    onChange({ ...color, [field]: Number(value) });
  };

  // Generate dynamic gradients based on current color
  // Saturation: varies from 0 (gray/white/black based on B) to 100 (full color) keeping current H and B
  const sGradientStart = hsbToHslString(color.h, 0, color.b);
  const sGradientEnd = hsbToHslString(color.h, 100, color.b);
  
  // Brightness: varies from 0 (black) to 100 (full bright) keeping current H and S
  const bGradientStart = hsbToHslString(color.h, color.s, 0);
  const bGradientEnd = hsbToHslString(color.h, color.s, 100);

  return (
    <div className="hsb-sliders-container">
      {/* Hue Slider */}
      <div className="slider-wrapper hue-wrapper">
        <input 
          type="range" 
          min="0" max="360" 
          value={color.h} 
          onChange={(e) => handleChange('h', e.target.value)}
          onPointerDown={() => onInteractStart && onInteractStart('HUE')}
          onPointerUp={() => onInteractEnd && onInteractEnd()}
          onPointerCancel={() => onInteractEnd && onInteractEnd()}
          className="color-slider"
        />
      </div>

      {/* Saturation Slider */}
      <div 
        className="slider-wrapper sat-wrapper"
        style={{
          background: `linear-gradient(to top, ${sGradientStart}, ${sGradientEnd})`
        }}
      >
        <input 
          type="range" 
          min="0" max="100" 
          value={color.s} 
          onChange={(e) => handleChange('s', e.target.value)}
          onPointerDown={() => onInteractStart && onInteractStart('SATURATION')}
          onPointerUp={() => onInteractEnd && onInteractEnd()}
          onPointerCancel={() => onInteractEnd && onInteractEnd()}
          className="color-slider"
        />
      </div>

      {/* Brightness Slider */}
      <div 
        className="slider-wrapper bri-wrapper"
        style={{
          background: `linear-gradient(to top, ${bGradientStart}, ${bGradientEnd})`
        }}
      >
        <input 
          type="range" 
          min="0" max="100" 
          value={color.b} 
          onChange={(e) => handleChange('b', e.target.value)}
          onPointerDown={() => onInteractStart && onInteractStart('BRIGHTNESS')}
          onPointerUp={() => onInteractEnd && onInteractEnd()}
          onPointerCancel={() => onInteractEnd && onInteractEnd()}
          className="color-slider"
        />
      </div>
    </div>
  );
};

export default HSBSliders;

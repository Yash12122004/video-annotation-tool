import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlash, faFont, faRainbow, faArrowPointer } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faSquare } from "@fortawesome/free-regular-svg-icons"
import { useVideo } from './VideoContext';

const toolIcons = {
  select: faArrowPointer,
  circle: faCircle,
  rectangle: faSquare,
  line: faSlash,
  text: faFont,
};

const cursors = {
  select: "default",
  text: "text",
}

const tools = ['select','circle', 'rectangle', 'line', 'text'];
const colorOptions = [
  '#ff0000', '#00ff00', '#0000ff', '#ffff00',
  '#ff00ff', '#00ffff', '#ffffff', '#000000',
  '#ffa500', '#800080', '#008000', 'custom'
];

export default function Toolbar({ dispatch, state }) {
  const { videoRef, currentTime } = useVideo();
  const colorInputRef = useRef(null);
  const [customColor, setCustomColor] = useState(state.color || '#ff0000');
  const [tempTime, setTempTime] = useState(state.annotationTime?.toFixed(2) || "2.00");

  const handleToolChange = (tool) => {
    videoRef.current.style.cursor = cursors[tool] ?? 'crosshair'
    dispatch({ type: 'SET_TOOL', payload: tool });
  };

  const handleTimeChange = (e) => {
    const duration = parseFloat(e.target.value);
    if (!isNaN(duration)) {
      setTempTime(e.target.value);
      dispatch({ type: 'SET_ANNOT_TIME', payload: e.target.value });
    }
  };  

  const handleColorSelect = (color, e) => {
    if (color === 'custom') {
      setCustomColor(e.target.value)
      dispatch({ type: 'SET_COLOR', payload: e.target.value })
    } else {
      dispatch({ type: 'SET_COLOR', payload: color });
    }
  };

  return (
    <div className="toolbar">
      <h3>Tools</h3>
      <div className="tool-buttons">
        {tools.map(tool => (
          <button
            key={tool}
            className={`tool-btn ${state.tool === tool ? 'active' : ''}`}
            onClick={() => handleToolChange(tool)}
            title={tool}
          >
            <FontAwesomeIcon icon={toolIcons[tool]} size="lg" />
          </button>
        ))}
      </div>

      <h3>Properties</h3> 
      <label>
        Time (s):
        <input
          type="number"
          step="0.01"
          min="0"
          value={tempTime}
          onChange={handleTimeChange}
        />
      </label>
      <div className='time-props'>
        Start Time (s): {(+currentTime).toFixed(2) || "0.00"} 
        <br />
        End Time (s): {Math.min((+currentTime + +tempTime).toFixed(2), videoRef.current?.duration.toFixed(2)) || "0.00"}
      </div>

      <label> Color: </label>
      <div className="color-grid">
        {colorOptions.map((color, i) =>
          color === 'custom' ? (
            <label style={{position: "relative"}}>
              <div
                key={i}
                className={`color-swatch rainbow ${state.color == customColor && !colorOptions.includes(state.color) ? "active" : ""}`}
                title="Custom"
                onClick={() => handleColorSelect('custom')}
              >
                <FontAwesomeIcon icon={faRainbow} />
              </div>
              <input
                type="color"
                className="color-swatch rainbow"
                title='Custom'
                ref={colorInputRef}
                value={customColor}
                style={{opacity: '0', position: 'absolute'}}
                onChange={(e) => handleColorSelect('custom', e)}
              />
            </label>
          ) : (
            <div
              key={i}
              className={`color-swatch ${state.color == color ? "active" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
              />
            )
          )}
          
      </div>
    </div>
  );
}

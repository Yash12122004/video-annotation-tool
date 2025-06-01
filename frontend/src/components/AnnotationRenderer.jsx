import React from 'react';

export default function AnnotationRenderer({ 
  annotations, 
  currentTime, 
  selectedAnnotation, 
  selectAnnotation, 
  startDrag, 
  tool 
}) {
  const visibleAnnotations = annotations.filter(annot => 
    currentTime >= annot.start && currentTime <= annot.end
  );

  return (
    <>
      {visibleAnnotations.map((annot, i) => {
        const isSelected = selectedAnnotation?.id === annot.id;
        
        if (annot.tool === 'text') {
          return (
            <div
              key={annot.id || i}
              className="annotation annot-text"
              style={{
                position: 'absolute',
                left: `${annot.x}px`,
                top: `${annot.y}px`,
                color: annot.color,
                fontSize: '16px',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                backgroundColor: isSelected ? 'rgba(255,255,0,0.3)' : 'rgba(255,255,255,0.2)',
                padding: '2px 6px',
                borderRadius: '3px',
                cursor: tool === 'select' ? 'move' : 'default',
                border: isSelected ? '2px solid yellow' : 'none',
              }}
              onClick={(e) => selectAnnotation(annot, e)}
              onMouseDown={(e) => startDrag(annot, e)}
            >
              {annot.text}
            </div>
          );
        }

        if (annot.tool === 'line') {
          const x1 = annot.startX;
          const y1 = annot.startY;
          const x2 = annot.endX;
          const y2 = annot.endY;
          const length = Math.hypot(x2 - x1, y2 - y1);
          const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

          return (
            <div
              key={annot.id || i}
              className="annotation annot-line"
              style={{
                position: 'absolute',
                left: `${x1}px`,
                top: `${y1}px`,
                width: `${length}px`,
                height: '2px',
                backgroundColor: annot.color || 'red',
                transformOrigin: '0 0',
                transform: `rotate(${angle}deg)`,
                cursor: tool === 'select' ? 'move' : 'default',
                boxShadow: isSelected ? '0 0 0 2px yellow' : 'none',
              }}
              onClick={(e) => selectAnnotation(annot, e)}
              onMouseDown={(e) => startDrag(annot, e)}
            />
          );
        }

        return (
          <div
            key={annot.id || i}
            className={`annotation annot-${annot.tool}`}
            style={{
              position: 'absolute',
              border: `2px dashed ${annot.color}`,
              left: Math.min(annot.startX, annot.endX) + 'px',
              top: Math.min(annot.startY, annot.endY) + 'px',
              width: annot.width + 'px',
              height: annot.height + 'px',
              transform: `scale(${annot.scaleX}, ${annot.scaleY})`,
              cursor: tool === 'select' ? 'move' : 'default',
              backgroundColor: isSelected ? 'rgba(255,255,0,0.1)' : 'transparent',
              boxShadow: isSelected ? '0 0 0 2px yellow' : 'none',
            }}
            onClick={(e) => selectAnnotation(annot, e)}
            onMouseDown={(e) => startDrag(annot, e)}
          />
        );
      })}
    </>
  );
}

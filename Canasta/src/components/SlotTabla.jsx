import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import './SlotTabla.css';
export function SlotTabla({ id, children, style }) {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div 
            ref={setNodeRef} 
            className={`slot-tabla ${isOver ? 'activ' : ''}`}
            style={style} 
        >
            {children}
        </div>
    );
}
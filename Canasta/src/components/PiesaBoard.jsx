import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './PiesaBoard.css';

export function PiesaBoard({ piesa, blocata })
{
    const {attributes, listeners, setNodeRef, transform, transition, isDragging}=useDraggable({
        id: piesa.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform), 
        transition: isDragging ? 'none' : transition, 
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0 : 1,                
    };

    const determinaClasaCuloare = ()=>{
        if (piesa.valoare==='Joly') return 'culoare-joly';
        
        switch (piesa.culoare) {
            case 'Rosu' : return 'culoare-rosu';
            case 'Albastru' : return 'culoare-albastru';
            case 'Negru' : return 'culoare-negru';
            case 'Galben' : return 'culoare-galben';
            default: return 'culoare-negru';
        }
    };

    return (
        <div
            ref={blocata ? null : setNodeRef}
            style={style}
            {...(blocata ? {} : listeners)}
            {...(blocata ? {} : attributes)}
            className={`piesa-board ${determinaClasaCuloare()}`}>
            {piesa.valoare}
        </div>
    );
}
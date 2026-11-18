import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { PiesaBoard } from './PiesaBoard';

export function ZonaDecartare ({piesaDinTop})
{
    const { isOver, setNodeRef }=useDroppable({
        id: 'zona-decartare'
    });

    const style= { backgroundColor: isOver ? 'rgba(46, 125,50,0.2)' : 'transparent',
        transition: 'background-color 0.2 ease'
    };

    return (
        <div ref={setNodeRef} className='zona-decartare' style={style}>
            {piesaDinTop ? (<PiesaBoard piesa={piesaDinTop}  blocata={true}/>) : (<div className='piesa-placeholder'></div>)}
        </div>
    );
}
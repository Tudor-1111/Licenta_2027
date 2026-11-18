import React, { useState } from 'react';
import { initializeazaJoc, tragePiesaDinSac, punctajFormatii, executaEtalare } from './logic/Joc.js';
import { PiesaBoard } from './components/PiesaBoard.jsx';
import { DndContext } from '@dnd-kit/core';
import { ZonaDecartare } from './components/ZonaDecartare.jsx';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { DragOverlay } from '@dnd-kit/core';
import { SlotTabla } from './components/SlotTabla.jsx';
import './App.css';

function App() {
    const [stareJoc, setStareJoc]=useState(initializeazaJoc());
    const [idPiesaActiva, setIdPiesaActiva] = useState(null);

    const handleTragePiesa = () => {
        let rezultat=tragePiesaDinSac(stareJoc.tablaJucator1,stareJoc.sac);
        setStareJoc({...stareJoc, tablaJucator1: rezultat.tablaJucator, sac: rezultat.sac});
    };

    const handleDecarteaza = (piesaDeAruncat) => {
        let copieTabla=[...stareJoc.tablaJucator1.filter((p)=>p.id!=piesaDeAruncat.id)];

        let copieGramada=[...stareJoc.gramadaDecartare,piesaDeAruncat];

        setStareJoc({...stareJoc,tablaJucator1: copieTabla, gramadaDecartare:copieGramada});

    };

    const handleDragStart = (event) => {
    setIdPiesaActiva(event.active.id);
    };  

    const handleDragEnd = (event) => { 
        setIdPiesaActiva(null);
        const {active, over}=event;

        if (!over)
            return;

        const indexVechi = stareJoc.tablaJucator1.findIndex((p) => p && p.id === active.id);
            if (indexVechi === -1) return;

        if (String(over.id).startsWith('slot-')) {
            const indexNou = parseInt(over.id.replace('slot-', ''));
            let copieTabla = [...stareJoc.tablaJucator1];
            
            // Facem rocada intre slotul vechi si cel nou (chiar daca cel nou e null)
            const piesaMutata = copieTabla[indexVechi];
            const piesaDinDestinatie = copieTabla[indexNou];

            copieTabla[indexVechi] = piesaDinDestinatie;
            copieTabla[indexNou] = piesaMutata;

            setStareJoc({ ...stareJoc, tablaJucator1: copieTabla });
        }

        // 3. Daca o aruncam pe decartare
        if (over.id === 'zona-decartare') {
            const piesaAruncata = stareJoc.tablaJucator1[indexVechi];
            
            let copieTabla = [...stareJoc.tablaJucator1];
            copieTabla[indexVechi] = null; // Lasam sertarul gol pe tabla

            let copieGramada = [...stareJoc.gramadaDecartare, piesaAruncata];
            setStareJoc({ ...stareJoc, tablaJucator1: copieTabla, gramadaDecartare: copieGramada });
        }

    };

    const handleEtaleaza = () => {
        const rezultat = executaEtalare(stareJoc);
        if (rezultat.eroare) {
            alert(rezultat.eroare); // Mai tarziu putem face o notificare eleganta in loc de alert
        } else {
            setStareJoc(rezultat.stareNoua);
        }
    };

    const formatiiValide = punctajFormatii(stareJoc.tablaJucator1);

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="masa-joc-container">
            <h1>Masa de Joc - Canasta</h1>
            <p>Piese ramase in sac: {stareJoc.sac.length}</p>
            <button onClick={handleTragePiesa}>Trage Piesa</button>
            <h2>Gramada decartare</h2>
            <ZonaDecartare 
                piesaDinTop={stareJoc.gramadaDecartare.length > 0 ? stareJoc.gramadaDecartare.at(-1) : null} 
            />
            <div className="panou-control">
                <p>Scor etalat: <strong>{stareJoc.scorJucator1} pct</strong></p>
                <button onClick={handleTragePiesa}>Trage Piesa</button>
                <button onClick={handleEtaleaza} className="buton-etaleaza">Etaleaza Formatii</button>
            </div>

            <h2>Masa de Etalare (Formatii coborate)</h2>
            <div className="zona-etalare">
                {stareJoc.etalateJucator1.length === 0 ? (
                    <p className="text-gol">Nicio formatie etalata inca (minim 50 pct pentru deschidere)</p>
                ) : (
                    stareJoc.etalateJucator1.map((grup, indexGrup) => (
                        <div key={`grup-${indexGrup}`} className="grup-etalat">
                            {grup.map(piesa => (
                                <PiesaBoard key={piesa.id} piesa={piesa} />
                            ))}
                        </div>
                    ))
                )}
            </div>
            <h2>Piesele tale</h2>
            <div className="masa-joc">
                {stareJoc.tablaJucator1.map((piesa, index) => {
                    // Calculam coordonatele fixe pentru fiecare casuta
                    const randSlot = Math.floor(index / 20) + 1;
                    const colSlot = (index % 20) + 1;

                    return (
                        <SlotTabla 
                            key={`slot-${index}`} 
                            id={`slot-${index}`}
                            style={{ gridRow: randSlot, gridColumn: colSlot }}
                        >
                            {piesa ? (
                                <PiesaBoard piesa={piesa} />
                            ) : null}
                        </SlotTabla>
                    );
                })}
                {formatiiValide.map((formatie, i) => {
                    // Calculam exact pe ce rand si intre ce coloane trebuie sa intindem linia
                    // Coloanele in CSS Grid incep de la 1, deci adaugam + 1
                    const randul = Math.floor(formatie.indexStart / 20) + 1; 
                    const colStart = (formatie.indexStart % 20) + 1;
                    const colEnd = colStart + formatie.lungime;

                    return (
                        <div 
                            key={`linie-scor-${i}`} 
                            className="linie-scor-formatie"
                            style={{
                                gridRow: randul,
                                gridColumn: `${colStart} / ${colEnd}`
                            }}
                        >
                            <div className="text-scor">+{formatie.puncte} pct</div>
                        </div>
                    );
                })}
            </div>
        </div>
        <DragOverlay>
            {idPiesaActiva && stareJoc.tablaJucator1.find(p => p && p.id === idPiesaActiva) ? (
                <PiesaBoard 
                    piesa={stareJoc.tablaJucator1.find(p => p && p.id === idPiesaActiva)} 
                    inOverlay={true} 
                />
            ) : null}
        </DragOverlay>
        </DndContext>
    );
}

export default App;
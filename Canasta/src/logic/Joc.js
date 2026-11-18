import { genereazaSac, amestecaSac } from "../models/Sac";

export function initializeazaJoc()
{
let sac = genereazaSac();
sac=amestecaSac(sac);

const tablaJucator1=sac.splice(0,15);
const tablaJucator2=sac.splice(0,15);

const primaPiesa=sac.splice(0,1);
const gramadaDecartare=[...primaPiesa];

while (tablaJucator1.length < 40) {
    tablaJucator1.push(null);
}

return {
    sac: sac,
    gramadaDecartare: gramadaDecartare,
    tablaJucator1: tablaJucator1,
    tablaJucator2: tablaJucator2,
    etalateJucator1: [],
    scorJucator1: 0,   
    areDeschidere1: false,
    tura: 1
};

}

export function tragePiesaDinSac(tablaJucator, sac)
{
    if (sac.length === 0) {
        return { tablaJucator: tabla, sac: sac };
    }

    const piesaTrasa=sac[0];
    const sacNou=sac.slice(1);
    let tablaNoua=[...tablaJucator];

    const primulIndexLiber = tablaNoua.findIndex((slot) => slot === null);

    if (primulIndexLiber !== -1) {
        tablaNoua[primulIndexLiber] = piesaTrasa;
    } else {
        tablaNoua.push(piesaTrasa);
    }

    return {
        tablaJucator: tablaNoua,
        sac: sacNou 
    };
}

export function decarteazaPiesa(tablaJucator, gramadaDecartare, idPiesa)
{
    let index;
    for (let i=0;i<tablaJucator.length;i++)
    {
        if(tablaJucator[i].id===idPiesa)
            index=i;
    }

    gramadaDecartare.push(...tablaJucator.splice(index,1));

    return {
        tablaJucator: tablaJucator,
        gramadaDecartare: gramadaDecartare
    };
}

export function valideazaEtalare (pieseDeEtalat)
{
    if (pieseDeEtalat.length<3) return false;

    let countNormale=0;
    let primaPiesaNormala=null;
    for (const piesa of pieseDeEtalat)
    {
        if (piesa.valoare!='Joly' && piesa.valoare!=2)
        {
            countNormale++;
            if (primaPiesaNormala===null)
                primaPiesaNormala=piesa; 
            else if (primaPiesaNormala.valoare!=piesa.valoare) return false;
        }
    }

    if (countNormale<2) return false;
    if (pieseDeEtalat.length-countNormale>3) return false;

    return true;
}

export function calculeazaPunctajEtalare (pieseDeEtalat)
{
    let suma=0;
    for (const piesa of pieseDeEtalat)
        suma+=piesa.puncte
    return suma;
}

export function verificaCanasta(pieseDeEtalat)
{
    if (pieseDeEtalat.length<7) return false;

    for (const piesa of pieseDeEtalat)
        if (piesa.valoare==='Joly' || piesa.valoare===2)
            return "Mixta";
    
    return "Pura";
}

export function punctajFormatii(tabla)
{
    let formatiiGasite = [];
    let formatieCurenta = [];
    let indexStart = null;

    for (let index = 0; index < tabla.length; index++)
    {
        const piesa = tabla[index];

        if (piesa === null)
        {
            // Folosim direct functia ta care stie regulile cu Joly si 2!
            if (valideazaEtalare(formatieCurenta))
            {
                formatiiGasite.push({
                    piese: formatieCurenta,
                    puncte: calculeazaPunctajEtalare(formatieCurenta),
                    indexStart: indexStart,
                    lungime: formatieCurenta.length
                });
            }

            formatieCurenta = [];
        }
        else 
        {
            if (formatieCurenta.length === 0) {
                indexStart = index;
            }
            formatieCurenta.push(piesa);
        }
    }

    // Verificam si la finalul tablei folosind aceeasi functie
    if (valideazaEtalare(formatieCurenta))
    {
        formatiiGasite.push({
            piese: formatieCurenta,
            puncte: calculeazaPunctajEtalare(formatieCurenta),
            indexStart: indexStart,
            lungime: formatieCurenta.length
        });
    }

    return formatiiGasite;
}

export function executaEtalare(stareCurenta) {
    // 1. Detectam din nou formatiile direct din datele reale ale tablei
    const formatiiValide = punctajFormatii(stareCurenta.tablaJucator1);

    if (formatiiValide.length === 0) {
        return { eroare: "Nu ai nicio formatie valida pe tabla!" };
    }

    // 2. Calculam punctajul total al formatiilor pe care vrea sa le coboare
    let puncteRundaAsta = 0;
    for (const f of formatiiValide) {
        puncteRundaAsta += f.puncte;
    }

    // 3. Verificam regula de deschidere (minim 50 de puncte la prima etalare)
    if (!stareCurenta.areDeschidere1 && puncteRundaAsta < 50) {
        return { eroare: `Ai nevoie de minim 50 de puncte pentru prima etalare! (Ai doar ${puncteRundaAsta})` };
    }

    // 4. Daca a trecut de validari, scoatem piesele de pe tabla jucatorului (punem null in locul lor)
    let tablaNoua = [...stareCurenta.tablaJucator1];
    let formatiiNoiPeMasa = [...stareCurenta.etalateJucator1];

    for (const f of formatiiValide) {
        // Adaugam grupul de piese pe masa comuna
        formatiiNoiPeMasa.push(f.piese);

        // Stergem piesele de pe tabla personala folosind ID-ul lor
        for (const piesaEtalata of f.piese) {
            const indexPeTabla = tablaNoua.findIndex(p => p && p.id === piesaEtalata.id);
            if (indexPeTabla !== -1) {
                tablaNoua[indexPeTabla] = null;
            }
        }
    }

    // 5. Returnam noua stare oficiala a jocului
    return {
        stareNoua: {
            ...stareCurenta,
            tablaJucator1: tablaNoua,
            etalateJucator1: formatiiNoiPeMasa,
            scorJucator1: stareCurenta.scorJucator1 + puncteRundaAsta,
            areDeschidere1: true
        }
    };
}
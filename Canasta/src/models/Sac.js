import {Piesa} from './Piesa.js';

export function genereazaSac()
{
    const culori=['Rosu', 'Negru', 'Albastru', 'Galben'];
    const sac=[];

    for (let set=0;set<2;set++)
    {
        for (let culoare of culori)
        {
            for (let valoare=1;valoare<=13;valoare++)
                sac.push(new Piesa(valoare,culoare));
        }
    }

    for (let i=0;i<4;i++)
        sac.push(new Piesa('Joly', null));

    return sac;
}

export function amestecaSac(sac)
{
    for (let i=sac.length-1;i>0;i--)
    {
        const j=Math.floor(Math.random()*(i+1));
        const aux=sac[i];
        sac[i]=sac[j];
        sac[j]=aux;
    }

    return sac;
}
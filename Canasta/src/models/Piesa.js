export class Piesa
{
    constructor(valoare, culoare)
    {
        this.valoare=valoare;
        this.culoare=culoare;
        this.puncte=this.calculeazaPuncte(valoare);
        this.id=crypto.randomUUID();
    }

    calculeazaPuncte(valoare)
    {
        if (valoare==='Joly') return 50;
        if (valoare===1 || valoare===2) return 20;
        if (valoare >= 8 && valoare <= 13) return 10;
        if (valoare >= 3 && valoare <= 7) return 5;
        return 0;
    }
}
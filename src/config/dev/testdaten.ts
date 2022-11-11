/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { type Auto } from '../../auto/entity/auto.entity.js';
import { type Kategorie } from './../../auto/entity/kategorie.entity.js';

// TypeORM kann keine SQL-Skripte ausfuehren

export const autos: Auto[] = [
    // -------------------------------------------------------------------------
    // L e s e n
    // -------------------------------------------------------------------------
    {
        id: '00000000-0000-0000-0000-000000000001',
        version: 0,
        modell: 'Alpha',
        ps: 4,
        art: 'VERBRENNER',
        hersteller: 'AUDI',
        preis: 11.1,
        rabatt: 0.011,
        lieferbar: true,
        datum: new Date('2022-02-01'),
        // "Konzeption und Realisierung eines aktiven Datenbanksystems"
        modellnummer: '9783897225831',
        homepage: 'https://acme.at/',
        kategorien: [],
        erzeugt: new Date('2022-02-01'),
        aktualisiert: new Date('2022-02-01'),
    },
    {
        id: '00000000-0000-0000-0000-000000000002',
        version: 0,
        modell: 'Beta',
        ps: 2,
        art: 'ELEKTRO',
        hersteller: 'BMW',
        preis: 22.2,
        rabatt: 0.022,
        lieferbar: true,
        datum: new Date('2022-02-02'),
        // "Verteilte Komponenten und Datenbankanbindung"
        modellnummer: '9783827315526',
        homepage: 'https://acme.biz/',
        kategorien: [],
        erzeugt: new Date('2022-02-02'),
        aktualisiert: new Date('2022-02-02'),
    },
    {
        id: '00000000-0000-0000-0000-000000000003',
        version: 0,
        modell: 'Gamma',
        ps: 1,
        art: 'VERBRENNER',
        hersteller: 'AUDI',
        preis: 33.3,
        rabatt: 0.033,
        lieferbar: true,
        datum: new Date('2022-02-03'),
        // "Design Patterns"
        modellnummer: '9780201633610',
        homepage: 'https://acme.com/',
        kategorien: [],
        erzeugt: new Date('2022-02-03'),
        aktualisiert: new Date('2022-02-03'),
    },
    // -------------------------------------------------------------------------
    // A e n d e r n
    // -------------------------------------------------------------------------
    {
        id: '00000000-0000-0000-0000-000000000040',
        version: 0,
        modell: 'Delta',
        ps: 3,
        art: 'VERBRENNER',
        hersteller: 'BMW',
        preis: 44.4,
        rabatt: 0.044,
        lieferbar: true,
        datum: new Date('2022-02-04'),
        // "Freiburger Chorbuch"
        modellnummer: '0007097328',
        homepage: 'https://acme.de/',
        kategorien: [],
        erzeugt: new Date('2022-02-04'),
        aktualisiert: new Date('2022-02-04'),
    },
    // -------------------------------------------------------------------------
    // L o e s c h e n
    // -------------------------------------------------------------------------
    {
        id: '00000000-0000-0000-0000-000000000050',
        version: 0,
        modell: 'Epsilon',
        ps: 2,
        art: 'ELEKTRO',
        hersteller: 'AUDI',
        preis: 55.5,
        rabatt: 0.055,
        lieferbar: true,
        datum: new Date('2022-02-05'),
        // "Maschinelle Lernverfahren zur Behandlung von Bonitätsrisiken im Mobilfunkgeschäft"
        modellnummer: '9783824404810',
        homepage: 'https://acme.es/',
        kategorien: [],
        erzeugt: new Date('2022-02-05'),
        aktualisiert: new Date('2022-02-05'),
    },
    {
        id: '00000000-0000-0000-0000-000000000060',
        version: 0,
        modell: 'Phi',
        ps: 2,
        art: 'ELEKTRO',
        hersteller: 'AUDI',
        preis: 66.6,
        rabatt: 0.066,
        lieferbar: true,
        datum: new Date('2022-02-06'),
        // "Software pioneers",
        modellnummer: '9783540430810',
        homepage: 'https://acme.it/',
        kategorien: [],
        erzeugt: new Date('2022-02-06'),
        aktualisiert: new Date('2022-02-06'),
    },
];

export const kategorien: Kategorie[] = [
    {
        id: '00000000-0000-0000-0000-010000000001',
        auto: autos[0],
        kategorie: 'KOMBI',
    },
    {
        id: '00000000-0000-0000-0000-020000000001',
        auto: autos[1],
        kategorie: 'SUV',
    },
    {
        id: '00000000-0000-0000-0000-030000000001',
        auto: autos[2],
        kategorie: 'KOMBI',
    },
    {
        id: '00000000-0000-0000-0000-030000000002',
        auto: autos[2],
        kategorie: 'SUV',
    },
    {
        id: '00000000-0000-0000-0000-500000000001',
        auto: autos[4],
        kategorie: 'SUV',
    },
    {
        id: '00000000-0000-0000-0000-600000000001',
        auto: autos[5],
        kategorie: 'SUV',
    },
];

autos[0]!.kategorien.push(kategorien[0]!);
autos[1]!.kategorien.push(kategorien[1]!);
autos[2]!.kategorien.push(kategorien[2]!, kategorien[3]!);
autos[4]!.kategorien.push(kategorien[4]!);
autos[5]!.kategorien.push(kategorien[5]!);

/* eslint-enable @typescript-eslint/no-non-null-assertion */

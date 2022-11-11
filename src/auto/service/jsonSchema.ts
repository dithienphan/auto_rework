import { type GenericJsonSchema } from './GenericJsonSchema.js';

export const jsonSchema: GenericJsonSchema = {
    // naechstes Release: 2021-02-01
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://acme.com/auto.json#',
    title: 'Auto',
    description: 'Eigenschaften eines Autos: Typen und Constraints',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            pattern:
                '^[\\dA-Fa-f]{8}-[\\dA-Fa-f]{4}-[\\dA-Fa-f]{4}-[\\dA-Fa-f]{4}-[\\dA-Fa-f]{12}$',
        },
        version: {
            type: 'number',
            minimum: 0,
        },
        modell: {
            type: 'string',
            pattern: '^\\w.*',
        },
        ps: {
            type: 'number',
            minimum: 0,
        },
        art: {
            type: 'string',
            enum: ['VERBRENNER', 'ELEKTRO', ''],
        },
        hersteller: {
            type: 'string',
            enum: ['BMW', 'AUDI', ''],
        },
        preis: {
            type: 'number',
            minimum: 0,
        },
        rabatt: {
            type: 'number',
            exclusiveMinimum: 0,
            exclusiveMaximum: 1,
        },
        lieferbar: { type: 'boolean' },
        datum: { type: 'string', format: 'date' },
        modellnummer: { type: 'string', format: 'MODELLNUMMER' },
        homepage: { type: 'string', format: 'uri' },
        kategorien: {
            type: 'array',
            items: { type: 'object' },
        },
        erzeugt: { type: ['string', 'null'] },
        aktualisiert: { type: ['string', 'null'] },
    },
    required: ['modell', 'hersteller', 'preis', 'modellnummer'],
    additionalProperties: false,
    errorMessage: {
        properties: {
            version: 'Die Versionsnummer muss mindestens 0 sein.',
            modell: 'Ein Automodell muss mit einem Buchstaben, einer Ziffer oder _ beginnen.',
            ps: 'Die PS muss höher als 0 sein.',
            art: 'Die Art eines Autos muss ELEKTRO oder VERBRENNER sein.',
            hersteller: 'Der Hersteller eines Autos muss AUDI oder BMW sein.',
            preis: 'Der Preis darf nicht negativ sein.',
            rabatt: 'Der Rabatt muss ein Wert zwischen 0 und 1 sein.',
            lieferbar: '"lieferbar" muss auf true oder false gesetzt sein.',
            datum: 'Das Datum muss im Format yyyy-MM-dd sein.',
            modellnummer: 'Die MODELLNUMMER-Nummer ist nicht korrekt.',
            homepage: 'Die Homepage ist nicht korrekt.',
        },
    },
};

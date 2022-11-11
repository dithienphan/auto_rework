/* eslint-disable no-underscore-dangle */

import { afterAll, beforeAll, describe, test } from '@jest/globals';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import {
    host,
    httpsAgent,
    port,
    shutdownServer,
    startServer,
} from '../testserver.js';
import { type AutosModel } from '../../src/auto/rest/auto-get.controller.js';
import { HttpStatus } from '@nestjs/common';
import each from 'jest-each';

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const modellVorhanden = ['a', 't', 'g'];
const modellNichtVorhanden = ['xx', 'yy'];
const kategorienVorhanden = ['kombi', 'suv'];
const kategorienNichtVorhanden = ['csharp', 'php'];

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
// eslint-disable-next-line max-lines-per-function
describe('GET /', () => {
    let baseURL: string;
    let client: AxiosInstance;

    beforeAll(async () => {
        await startServer();
        baseURL = `https://${host}:${port}`;
        client = axios.create({
            baseURL,
            httpsAgent,
            validateStatus: () => true,
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });

    test('Alle Autos', async () => {
        // given

        // when
        const response: AxiosResponse<AutosModel> = await client.get('/');

        // then
        const { status, headers, data } = response;

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data).toBeDefined();

        const { autos } = data._embedded;

        autos
            .map((auto) => auto._links.self.href)
            .forEach((selfLink) => {
                // eslint-disable-next-line security/detect-non-literal-regexp, security-node/non-literal-reg-expr
                expect(selfLink).toMatch(new RegExp(`^${baseURL}`, 'iu'));
            });
    });

    each(modellVorhanden).test(
        'Autos mit einem Modell, der "%s" enthaelt',
        async (teilModell: string) => {
            // given
            const params = { modell: teilModell };

            // when
            const response: AxiosResponse<AutosModel> = await client.get('/', {
                params,
            });

            // then
            const { status, headers, data } = response;

            expect(status).toBe(HttpStatus.OK);
            expect(headers['content-type']).toMatch(/json/iu);
            expect(data).toBeDefined();

            const { autos } = data._embedded;

            // Jedes Auto hat einen Modell mit dem Teilstring 'a'
            autos
                .map((auto) => auto.modell)
                .forEach((modell: string) =>
                    expect(modell.toLowerCase()).toEqual(
                        expect.stringContaining(teilModell),
                    ),
                );
        },
    );

    each(modellNichtVorhanden).test(
        'Keine Autos mit einem Modell, der "%s" enthaelt',
        async (teilModell: string) => {
            // given
            const params = { modell: teilModell };

            // when
            const response: AxiosResponse<string> = await client.get('/', {
                params,
            });

            // then
            const { status, data } = response;

            expect(status).toBe(HttpStatus.NOT_FOUND);
            expect(data).toMatch(/^not found$/iu);
        },
    );

    each(kategorienVorhanden).test(
        'Mind. 1 Auto mit dem Kategorie "%s"',
        async (kategorie: string) => {
            // given
            const params = { [kategorie]: 'true' };

            // when
            const response: AxiosResponse<AutosModel> = await client.get('/', {
                params,
            });

            // then
            const { status, headers, data } = response;

            expect(status).toBe(HttpStatus.OK);
            expect(headers['content-type']).toMatch(/json/iu);
            // JSON-Array mit mind. 1 JSON-Objekt
            expect(data).toBeDefined();

            const { autos } = data._embedded;

            // Jedes Auto hat im Array der Kategorien z.B. "kombi"
            autos
                .map((auto) => auto.kategorien)
                .forEach((kategorien) =>
                    expect(kategorien).toEqual(
                        expect.arrayContaining([kategorie.toUpperCase()]),
                    ),
                );
        },
    );

    each(kategorienNichtVorhanden).test(
        'Keine Autos mit dem Kategorie "%s"',
        async (kategorie: string) => {
            // given
            const params = { [kategorie]: 'true' };

            // when
            const response: AxiosResponse<string> = await client.get('/', {
                params,
            });

            // then
            const { status, data } = response;

            expect(status).toBe(HttpStatus.NOT_FOUND);
            expect(data).toMatch(/^not found$/iu);
        },
    );

    test('Keine Autos zu einer nicht-vorhandenen Property', async () => {
        // given
        const params = { foo: 'bar' };

        // when
        const response: AxiosResponse<string> = await client.get('/', {
            params,
        });

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.NOT_FOUND);
        expect(data).toMatch(/^not found$/iu);
    });
});
/* eslint-enable no-underscore-dangle */

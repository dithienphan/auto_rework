import { Args, Query, Resolver } from '@nestjs/graphql';
import { type Auto } from '../entity/auto.entity.js';
import { AutoReadService } from '../service/auto-read.service.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { UseInterceptors } from '@nestjs/common';
import { UserInputError } from 'apollo-server-express';
import { getLogger } from '../../logger/logger.js';

export type AutoDTO = Omit<Auto, 'aktualisiert' | 'erzeugt' | 'kategorien'> & {
    kategorien: string[];
};
export interface IdInput {
    id: string;
}

@Resolver()
@UseInterceptors(ResponseTimeInterceptor)
export class AutoQueryResolver {
    readonly #service: AutoReadService;

    readonly #logger = getLogger(AutoQueryResolver.name);

    constructor(service: AutoReadService) {
        this.#service = service;
    }

    @Query('auto')
    async findById(@Args() id: IdInput) {
        const idStr = id.id;
        this.#logger.debug('findById: id=%s', idStr);

        const auto = await this.#service.findById(idStr);
        if (auto === undefined) {
            // UserInputError liefert Statuscode 200
            // Weitere Error-Klasse in apollo-server-errors:
            // SyntaxError, ValidationError, AuthenticationError, ForbiddenError,
            // PersistedQuery, PersistedQuery
            // https://www.apollographql.com/blog/graphql/error-handling/full-stack-error-handling-with-graphql-apollo
            throw new UserInputError(
                `Es wurde kein Auto mit der ID ${idStr} gefunden.`,
            );
        }
        const autoDTO = this.#toAutoDTO(auto);
        this.#logger.debug('findById: autoDTO=%o', autoDTO);
        return autoDTO;
    }

    @Query('autos')
    async find(@Args() modell: { modell: string } | undefined) {
        const modellStr = modell?.modell;
        this.#logger.debug('find: modell=%s', modellStr);
        const suchkriterium =
            modellStr === undefined ? {} : { modell: modellStr };
        const autos = await this.#service.find(suchkriterium);
        if (autos.length === 0) {
            // UserInputError liefert Statuscode 200
            throw new UserInputError('Es wurden keine Autos gefunden.');
        }

        const autosDTO = autos.map((auto) => this.#toAutoDTO(auto));
        this.#logger.debug('find: autosDTO=%o', autosDTO);
        return autosDTO;
    }

    #toAutoDTO(auto: Auto) {
        const kategorien = auto.kategorien.map(
            (kategorie) => kategorie.kategorie!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        );
        const autoDTO: AutoDTO = {
            id: auto.id,
            version: auto.version,
            modell: auto.modell,
            ps: auto.ps,
            art: auto.art,
            hersteller: auto.hersteller,
            preis: auto.preis,
            rabatt: auto.rabatt,
            lieferbar: auto.lieferbar,
            datum: auto.datum,
            modellnummer: auto.modellnummer,
            homepage: auto.homepage,
            kategorien,
        };
        return autoDTO;
    }
}

/**
 * Das Modul besteht aus der Klasse {@linkcode QueryBuilder}.
 * @packageDocumentation
 */

import { FindOptionsUtils, Repository, type SelectQueryBuilder } from 'typeorm';
import { Auto } from '../entity/auto.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { getLogger } from '../../logger/logger.js';
import { typeOrmModuleOptions } from '../../config/db.js';

/**
 * Die Klasse `QueryBuilder` implementiert das Lesen für Bücher und greift
 * mit _TypeORM_ auf eine relationale DB zu.
 */
@Injectable()
export class QueryBuilder {
    readonly #autoAlias = `${Auto.name
        .charAt(0)
        .toLowerCase()}${Auto.name.slice(1)}`;

    readonly #repo: Repository<Auto>;

    readonly #logger = getLogger(QueryBuilder.name);

    constructor(@InjectRepository(Auto) repo: Repository<Auto>) {
        this.#repo = repo;
    }

    /**
     * Ein Auto mit der ID suchen.
     * @param id ID des gesuchten Autos
     * @returns QueryBuilder
     */
    buildId(id: string) {
        const queryBuilder = this.#repo.createQueryBuilder(this.#autoAlias);
        // Option { eager: true } in der Entity-Klasse wird nur bei find-Methoden des Repositories beruecksichtigt
        // https://github.com/typeorm/typeorm/issues/8292#issuecomment-1036991980
        // https://github.com/typeorm/typeorm/issues/7142
        FindOptionsUtils.joinEagerRelations(
            queryBuilder,
            queryBuilder.alias,
            this.#repo.metadata,
        );

        queryBuilder.where(`${this.#autoAlias}.id = :id`, { id: id }); // eslint-disable-line object-shorthand
        return queryBuilder;
    }

    /**
     * Bücher asynchron suchen.
     * @param suchkriterien JSON-Objekt mit Suchkriterien
     * @returns QueryBuilder
     */
    // eslint-disable-next-line max-lines-per-function
    build(suchkriterien: Record<string, any>) {
        this.#logger.debug('build: suchkriterien=%o', suchkriterien);

        let queryBuilder = this.#repo.createQueryBuilder(this.#autoAlias);
        // Option { eager: true } in der Entity-Klasse wird nur bei find-Methoden des Repositories beruecksichtigt
        // https://github.com/typeorm/typeorm/issues/8292#issuecomment-1036991980
        // https://github.com/typeorm/typeorm/issues/7142
        FindOptionsUtils.joinEagerRelations(
            queryBuilder,
            queryBuilder.alias,
            this.#repo.metadata,
        );

        // z.B. { modell: 'a', ps: 5, kombi: true }
        // Rest Properties fuer anfaengliche WHERE-Klausel
        // type-coverage:ignore-next-line
        const { modell, modellnummer, kombi, suv, ...props } = suchkriterien;

        queryBuilder = this.#buildKategorien(
            queryBuilder,
            kombi, // eslint-disable-line @typescript-eslint/no-unsafe-argument
            suv, // eslint-disable-line @typescript-eslint/no-unsafe-argument
        );

        let useWhere = true;

        // Modell in der Query: Teilstring des Modells und "case insensitive"
        // CAVEAT: MySQL hat keinen Vergleich mit "case insensitive"
        // type-coverage:ignore-next-line
        if (modell !== undefined && typeof modell === 'string') {
            const ilike =
                typeOrmModuleOptions.type === 'postgres' ? 'ilike' : 'like';
            queryBuilder = queryBuilder.where(
                `${this.#autoAlias}.modell ${ilike} :modell`,
                { modell: `%${modell}%` },
            );
            useWhere = false;
        }

        // type-coverage:ignore-next-line
        if (modellnummer !== undefined && typeof modellnummer === 'string') {
            // "-" aus MODELLNUMMER-Nummer entfernen, da diese nicht abgespeichert sind
            const modellnummerOhne = modellnummer.replaceAll('-', '');
            const param = {
                modellnummer: modellnummerOhne,
            };
            queryBuilder = useWhere
                ? queryBuilder.where(
                      `${this.#autoAlias}.modellnummer = :modellnummer`,
                      param,
                  )
                : queryBuilder.andWhere(
                      `${this.#autoAlias}.modellnummer = :modellnummer`,
                      param,
                  );
        }

        // Restliche Properties als Key-Value-Paare: Vergleiche auf Gleichheit
        Object.keys(props).forEach((key) => {
            const param: Record<string, any> = {};
            param[key] = props[key]; // eslint-disable-line @typescript-eslint/no-unsafe-assignment, security/detect-object-injection
            queryBuilder = useWhere
                ? queryBuilder.where(
                      `${this.#autoAlias}.${key} = :${key}`,
                      param,
                  )
                : queryBuilder.andWhere(
                      `${this.#autoAlias}.${key} = :${key}`,
                      param,
                  );
        });

        this.#logger.debug('build: sql=%s', queryBuilder.getSql());
        return queryBuilder;
    }

    #buildKategorien(
        queryBuilder: SelectQueryBuilder<Auto>,
        kombi: string | undefined,
        suv: string | undefined,
    ) {
        // Kategorie KOMBI aus der 2. Tabelle
        if (kombi === 'true') {
            // https://typeorm.io/select-query-builder#inner-and-left-joins
            // eslint-disable-next-line no-param-reassign
            queryBuilder = queryBuilder.innerJoinAndSelect(
                `${this.#autoAlias}.kategorien`,
                'swJS',
                'swJS.kategorie = :kombi',
                { kombi: 'KOMBI' },
            );
        }
        if (suv === 'true') {
            // eslint-disable-next-line no-param-reassign
            queryBuilder = queryBuilder.innerJoinAndSelect(
                `${this.#autoAlias}.kategorien`,
                'swTS',
                'swTS.kategorie = :suv',
                { suv: 'SUV' },
            );
        }
        return queryBuilder;
    }
}

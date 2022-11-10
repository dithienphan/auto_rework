/* eslint-disable sort-imports */
/**
 * Das Modul enthält die Funktion, um die Test-DB neu zu laden.
 * @packageDocumentation
 */

import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import { dbPopulate, typeOrmModuleOptions } from '../db.js';
import { Auto } from '../../auto/entity/auto.entity.js';
import { autos } from './testdaten.js';
import { configDir } from '../node.js';
import { getLogger } from '../../logger/logger.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Kategorie } from '../../auto/entity/kategorie.entity.js';
import { Repository } from 'typeorm';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Die Test-DB wird im Development-Modus neu geladen, nachdem die Module
 * initialisiert sind, was duch `OnApplicationBootstrap` realisiert wird.
 */
@Injectable()
export class DbPopulateService implements OnApplicationBootstrap {
    readonly #repo: Repository<Auto>;

    readonly #logger = getLogger(DbPopulateService.name);

    readonly #autos = autos;

    /**
     * Initialisierung durch DI mit `Repository<Auto>` gemäß _TypeORM_.
     */
    constructor(@InjectRepository(Auto) repo: Repository<Auto>) {
        this.#repo = repo;
    }

    /**
     * Die Test-DB wird im Development-Modus neu geladen.
     */
    async onApplicationBootstrap() {
        await this.populateTestdaten();
    }

    async populateTestdaten() {
        if (!dbPopulate) {
            return;
        }

        await (typeOrmModuleOptions.type === 'postgres'
            ? this.#populatePostgres()
            : this.#populateMySQL());
    }

    async #populatePostgres() {
        const schema = Auto.name.toLowerCase();
        this.#logger.warn(
            `${typeOrmModuleOptions.type}: Schema ${schema} wird geloescht`,
        );
        await this.#repo.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`);

        const filename = 'create-table.sql';
        const createScript = resolve(
            configDir,
            'dev',
            typeOrmModuleOptions.type!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
            filename,
        );
        // https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options
        const sql = readFileSync(createScript, 'utf8');
        await this.#repo.query(sql);

        const saved = await this.#repo.save(this.#autos);
        this.#logger.warn(
            '#populatePostgres: %d Datensaetze eingefuegt',
            saved.length,
        );
    }

    async #populateMySQL() {
        let tabelle = Kategorie.name.toLowerCase();
        this.#logger.warn(
            `${typeOrmModuleOptions.type}: Tabelle ${tabelle} wird geloescht`,
        );
        await this.#repo.query(
            `DROP TABLE IF EXISTS ${Kategorie.name.toLowerCase()};`,
        );

        tabelle = Auto.name.toLowerCase();
        this.#logger.warn(
            `${typeOrmModuleOptions.type}: Tabelle ${tabelle} wird geloescht`,
        );
        await this.#repo.query(
            `DROP TABLE IF EXISTS ${Auto.name.toLowerCase()};`,
        );

        const scriptDir = resolve(configDir, 'dev', typeOrmModuleOptions.type!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
        let createScript = resolve(scriptDir, 'create-table-auto.sql');
        let sql = readFileSync(createScript, 'utf8');
        await this.#repo.query(sql);
        createScript = resolve(scriptDir, 'create-table-kategorie.sql');
        sql = readFileSync(createScript, 'utf8');
        await this.#repo.query(sql);

        const saved = await this.#repo.save(this.#autos);
        this.#logger.warn(
            '#populateMySQL: %d Datensaetze eingefuegt',
            saved.length,
        );
    }
}
/* eslint-enable sort-imports */

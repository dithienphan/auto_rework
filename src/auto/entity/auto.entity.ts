/**
 * Das Modul besteht aus der Entity-Klasse.
 * @packageDocumentation
 */

import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DecimalTransformer } from './decimal-transformer.js';
import { Kategorie } from './kategorie.entity.js';

/**
 * Alias-Typ für gültige Strings bei Herstelleren.
 * "Enums get compiled in a big monster of JavaScript".
 */
export type Hersteller = 'AUDI' | 'BMW';

/**
 * Alias-Typ für gültige Strings bei der Art eines Autos.
 */
export type AutoArt = 'ELEKTRO' | 'VERBRENNER';

/**
 * Entity-Klasse zu einem relationalen Tabelle
 */
// https://typeorm.io/entities
@Entity()
export class Auto {
    @Column('char')
    // https://typeorm.io/entities#primary-columns
    // CAVEAT: zuerst @Column() und erst dann @PrimaryColumn()
    @PrimaryColumn('uuid')
    id: string | undefined;

    @VersionColumn()
    readonly version: number | undefined;

    @Column('varchar')
    @ApiProperty({ example: 'Der Modell', type: String })
    readonly modell!: string; //NOSONAR

    @Column('int')
    @ApiProperty({ example: 5, type: Number })
    readonly ps: number | undefined;

    @Column('varchar')
    @ApiProperty({ example: 'VERBRENNER', type: String })
    readonly art: AutoArt | undefined;

    @Column('varchar')
    @ApiProperty({ example: 'AUDI', type: String })
    readonly hersteller!: Hersteller;

    @Column({ type: 'decimal', transformer: new DecimalTransformer() })
    @ApiProperty({ example: 1, type: Number })
    // statt number ggf. Decimal aus decimal.js analog zu BigDecimal von Java
    readonly preis!: number;

    @Column({ type: 'decimal', transformer: new DecimalTransformer() })
    @ApiProperty({ example: 0.1, type: Number })
    readonly rabatt: number | undefined;

    @Column('boolean')
    @ApiProperty({ example: true, type: Boolean })
    readonly lieferbar: boolean | undefined;

    // das Temporal-API ab ES2022 wird von TypeORM noch nicht unterstuetzt
    @Column('date')
    @ApiProperty({ example: '2021-01-31' })
    readonly datum: Date | string | undefined;

    @Column('varchar')
    @ApiProperty({ example: '0-0070-0644-6', type: String })
    readonly modellnummer!: string;

    @Column('varchar')
    @ApiProperty({ example: 'https://test.de/', type: String })
    readonly homepage: string | undefined;

    // https://typeorm.io/many-to-one-one-to-many-relations
    // Bei TypeORM gibt es nur bidirektionale Beziehungen, keine gerichteten
    @OneToMany(() => Kategorie, (kategorie) => kategorie.auto, {
        // https://typeorm.io/eager-and-lazy-relations
        // Join beim Lesen durch find-Methoden des Repositories
        eager: true,
        // https://typeorm.io/relations#cascades
        // kaskadierendes INSERT INTO
        cascade: ['insert'],
    })
    @ApiProperty({ example: ['KOMBI', 'SUV'] })
    readonly kategorien!: Kategorie[];

    // https://typeorm.io/entities#special-columns
    @CreateDateColumn({ type: 'timestamp' })
    readonly erzeugt: Date | undefined = new Date();

    @UpdateDateColumn({ type: 'timestamp' })
    readonly aktualisiert: Date | undefined = new Date();
}

export const removeModellnummerDash = (auto: Auto) => {
    // https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers
    const copy = auto as {
        -readonly [K in keyof Auto]: Auto[K]; // eslint-disable-line no-use-before-define
    };
    copy.modellnummer = auto.modellnummer.replaceAll('-', '');
    return copy;
};

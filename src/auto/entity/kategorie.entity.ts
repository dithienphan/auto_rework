/**
 * Das Modul besteht aus der Entity-Klasse.
 * @packageDocumentation
 */

import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Auto } from './auto.entity.js';

/**
 * Entity-Klasse zu einem relationalen Tabelle
 */
@Entity()
export class Kategorie {
    @Column('char')
    @PrimaryColumn('uuid')
    id: string | undefined;

    // https://typeorm.io/many-to-one-one-to-many-relations
    @ManyToOne(() => Auto, (auto) => auto.kategorien)
    // https://typeorm.io/relations#joincolumn-options
    @JoinColumn({ name: 'auto_id' })
    readonly auto: Auto | null | undefined;

    @Column('varchar')
    @ApiProperty({ example: 'Das Kategorie', type: String })
    readonly kategorie: string | null | undefined; //NOSONAR
}

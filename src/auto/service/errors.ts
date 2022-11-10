/**
 * Das Modul besteht aus den Klassen für die Fehlerbehandlung bei der Verwaltung
 * von Büchern, z.B. beim DB-Zugriff.
 * @packageDocumentation
 */

/**
 * Klasse für fehlerhafte Autodaten. Die Meldungstexte sind in der Property
 * `msg` gekapselt.
 */
export interface ConstraintViolations {
    readonly type: 'ConstraintViolations';
    readonly messages: string[];
}

/**
 * Klasse für einen bereits existierenden Modell.
 */
export interface ModellExists {
    readonly type: 'ModellExists';
    readonly modell: string | null | undefined;
    readonly id?: string;
}

/**
 * Klasse für eine bereits existierende MODELLNUMMER-Nummer.
 */
export interface ModellnummerExists {
    readonly type: 'ModellnummerExists';
    readonly modellnummer: string | null | undefined;
    readonly id?: string;
}

/**
 * Union-Type für Fehler beim Neuanlegen eines Autos:
 * - {@linkcode ConstraintViolations}
 * - {@linkcode ModellnummerExists}
 * - {@linkcode ModellExists}
 */
export type CreateError =
    | ConstraintViolations
    | ModellExists
    | ModellnummerExists;

/**
 * Klasse für eine ungültige Versionsnummer beim Ändern.
 */
export interface VersionInvalid {
    readonly type: 'VersionInvalid';
    readonly version: string | undefined;
}

/**
 * Klasse für eine veraltete Versionsnummer beim Ändern.
 */
export interface VersionOutdated {
    readonly type: 'VersionOutdated';
    readonly id: string;
    readonly version: number;
}

/**
 * Klasse für ein nicht-vorhandenes Auto beim Ändern.
 */
export interface AutoNotExists {
    readonly type: 'AutoNotExists';
    readonly id: string | undefined;
}

/**
 * Union-Type für Fehler beim Ändern eines Autos:
 * - {@linkcode AutoNotExists}
 * - {@linkcode ConstraintViolations}
 * - {@linkcode ModellExists}
 * - {@linkcode VersionInvalid}
 * - {@linkcode VersionOutdated}
 */
export type UpdateError =
    | AutoNotExists
    | ConstraintViolations
    | ModellExists
    | VersionInvalid
    | VersionOutdated;

/**
 * Klasse für eine nicht-vorhandene Binärdatei.
 */
export interface FileNotFound {
    readonly type: 'FileNotFound';
    readonly filename: string;
}

/**
 * Klasse, falls es mehrere Binärdateien zu einem Auto gibt.
 */
export interface MultipleFiles {
    readonly type: 'MultipleFiles';
    readonly filename: string;
}

/**
 * Klasse, falls der ContentType nicht korrekt ist.
 */
export interface InvalidContentType {
    readonly type: 'InvalidContentType';
}

/**
 * Union-Type für Fehler beim Lesen einer Binärdatei zu einem Auto:
 * - {@linkcode AutoNotExists}
 * - {@linkcode FileNotFound}
 * - {@linkcode InvalidContentType}
 * - {@linkcode MultipleFiles}
 */
export type FileFindError =
    | AutoNotExists
    | FileNotFound
    | InvalidContentType
    | MultipleFiles;

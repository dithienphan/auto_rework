CREATE TABLE IF NOT EXISTS auto (
    id            CHAR(36) NOT NULL PRIMARY KEY,
    version       INT NOT NULL DEFAULT 0,
    modell         VARCHAR(40) UNIQUE NOT NULL,
    ps        INT NOT NULL CHECK (ps >= 0 AND ps <= 5),
    art           VARCHAR(12) NOT NULL CHECK (art = 'VERBRENNER' OR art = 'ELEKTRO'),
    hersteller        VARCHAR(12) NOT NULL CHECK (hersteller = 'AUDI' OR hersteller = 'BMW'),
    preis         DECIMAL(8,2) NOT NULL,
    rabatt        DECIMAL(4,3) NOT NULL,
    lieferbar     BOOLEAN NOT NULL DEFAULT FALSE,
    datum         DATE,
    homepage      VARCHAR(40),
    modellnummer          VARCHAR(16) UNIQUE NOT NULL,
    erzeugt       DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    aktualisiert  DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP)
) TABLESPACE autospace ROW_FORMAT=COMPACT;

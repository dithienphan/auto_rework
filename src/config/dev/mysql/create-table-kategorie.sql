CREATE TABLE IF NOT EXISTS kategorie (
    id         CHAR(36) NOT NULL PRIMARY KEY,
    auto_id    CHAR(36) NOT NULL REFERENCES auto,
    kategorie VARCHAR(16) NOT NULL CHECK (kategorie = 'KOMBI' OR kategorie = 'SUV'),

    INDEX kategorie_auto_idx(auto_id)
) TABLESPACE autospace ROW_FORMAT=COMPACT;

# Decyzje — Etap 1

## 1. Separator w przechowywanych ścieżkach

- Data: 2026-04-18
- Kontekst: `path.relative` zwraca natywny separator (`\` na win32, `/` na POSIX). Persist do JSON.
- Opcje:
  - (a) Natywny `path.sep` — szybciej, ale config niespójny między platformami.
  - (b) Wymuszone `/` — config czytelny, deterministyczny, łatwy diff.
- Wybór: **(b)** — `toRelative` zamienia `path.sep` na `/`. `toAbsolute` używa `path.join` (automatycznie konwertuje przy odczycie).
- Konsekwencje: starsze configi z `\` w ścieżkach względnych (gdyby istniały) są normalizowane przy migracji.

## 2. Wpisy spoza `gothicPath` przy migracji

- Data: 2026-04-18
- Kontekst: stary config może zawierać absolutne ścieżki nie należące do aktualnej instalacji (przeniesiona gra, ręczna edycja).
- Opcje:
  - (a) Zachować takie wpisy jako absolutne (dual format) — komplikuje semantykę.
  - (b) Cicho odrzucić — proste, ryzyko utraty info.
  - (c) Odrzucić + log warning — kompromis.
- Wybór: **(c)** — `loggerWarn` z listą odrzuconych wpisów; nic nie kasujemy z dysku (zgodne z wymaganiem promptu).
- Konsekwencje: użytkownik widzi w logu które wpisy zostały usunięte z configu po migracji.

## 3. Granica konwersji abs ↔ rel

- Data: 2026-04-18
- Kontekst: `createdFiles` jest budowany przez wiele funkcji (`copyFiles`, `copyScriptsFiles`, `buildStringTable`, `buildWrldatasc`, `copyPresetInis`, `copyPresetDlls`) i używany w bloku `catch` do odwracania (`fs.unlinkSync`).
- Opcje:
  - (a) Konwersja u źródła — każda funkcja push'uje relatywne, w `catch` resolve do abs przez `toAbsolute`.
  - (b) Konwersja na granicy — `createdFiles` pozostaje absolute w toku instalacji, konwersja tylko przy zapisie do `configuration.filesCreated`.
- Wybór: **(b)** — minimalizuje liczbę zmienionych funkcji i ryzyko regresji w ścieżce odwracania błędów. Helper `toRelative`/`toAbsolute` używany na granicach: zapis configu (`installMods`), odczyt (`deleteMods`, `installedFilesExist`, `loadIniConfiguration`/`saveIniConfiguration`).
- Konsekwencje: lekkie odstępstwo od literalnego brzmienia wymagania #5 promptu (wpis relatywny w `copyFiles`); semantyka persistowanego configu identyczna, scope zmian mniejszy.

## 4. Sortowanie `filesCreated`

- Data: 2026-04-18
- Kontekst: `filesCreated` jest zapisywany jako `Array.from(new Set(createdFiles))` — kolejność zależna od wstawiania.
- Wybór: **bez zmian** (nie sortujemy). Sortowanie poza zakresem etapu; deterministyczność diffów configu nie jest blockerem.
- Konsekwencje: kolejność wpisów w configu zachowana zgodnie z dotychczasową semantyką.

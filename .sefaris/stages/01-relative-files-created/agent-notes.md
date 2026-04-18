# Notatki agenta — Etap 1

## Założenia

- `gothicPath` w configu jest zawsze absolutny i znormalizowany.
- Wszystkie aktualne `filesCreated` zaczynają się od `gothicPath` (potwierdzone przez analizę `installation-service.ts`).

## Znaleziska w kodzie

- `ini-service.ts` używa `file.includes(name)` — fragile, do zaostrzenia przy okazji.
- `copyFiles` w `file-service.ts` wpisuje absolute przez out-param `createdFiles` — punkt centralny do zmiany.

## Do późniejszych etapów

- Format `filesCreated` z metadanymi (mod-id, hash) — ułatwiłby częściową deinstalację.

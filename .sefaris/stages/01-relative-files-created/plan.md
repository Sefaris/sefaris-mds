# Plan: Etap 1 — `filesCreated` jako ścieżki relatywne

> Statusy: `[ ]` todo · `[~]` in-progress · `[x]` done · `[!]` zablokowane · `[-]` porzucone

## Kroki

- [ ] 1.1 Helper `toRelative(gothicPath, abs)` / `toAbsolute(gothicPath, rel)` w `packages/preload/src/services/file-service.ts` (normalizacja separatorów na `/`).
- [ ] 1.2 Test jednostkowy helpera (Windows i POSIX paths, edge cases: equal paths, paths poza gothicPath).
- [ ] 1.3 Refaktor `installation-service.ts::installMods` — zapis relatywnych w `createdFiles`.
- [ ] 1.4 Refaktor `installation-service.ts::deleteMods` — rozwiązywanie do absolute przed `unlinkSync`.
- [ ] 1.5 Refaktor `file-service.ts::copyFiles` — wpis relatywny.
- [ ] 1.6 Refaktor `configuration-service.ts::installedFilesExist` — rozwiązywanie do absolute.
- [ ] 1.7 Refaktor `ini-service.ts::iniFilePath` lookup — porównanie po basename / suffixie.
- [ ] 1.8 Migracja w `loadConfiguration`: detekcja absolute → konwersja, wpisy spoza `gothicPath` → odrzucenie + wpis w logu.
- [ ] 1.9 Aktualizacja testów `tests/preload/installation-service.spec.ts` i `tests/preload/configuration-service.spec.ts`.
- [ ] 1.10 Test migracji starego configu (snapshot przed/po).
- [ ] 1.11 Sprawdzenie `HomeView.vue` (reset filesCreated) — czy nie wymaga zmian po migracji.
- [ ] 1.12 Pełny `npm run test` + smoke manualny (instalacja moda → check JSON configu → przeniesienie folderu → deinstalacja).

## Out of scope
- Zmiana zachowania UI po przeniesieniu gry (to Etap 2).
- Restrukturyzacja `filesCreated` na strukturę z metadanymi mod-id (out of scope, ewentualnie w przyszłości).

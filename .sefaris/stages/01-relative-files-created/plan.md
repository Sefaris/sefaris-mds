# Plan: Etap 1 — `filesCreated` jako ścieżki relatywne

> Statusy: `[ ]` todo · `[~]` in-progress · `[x]` done · `[!]` zablokowane · `[-]` porzucone

## Kroki

- [x] 1.1 Helper `toRelative(gothicPath, abs)` / `toAbsolute(gothicPath, rel)` w `packages/preload/src/services/file-service.ts` (normalizacja separatorów na `/`).
- [x] 1.2 Test jednostkowy helpera (Windows i POSIX paths, edge cases: equal paths, paths poza gothicPath).
- [x] 1.3 Refaktor `installation-service.ts::installMods` — zapis relatywnych w `createdFiles`.
- [x] 1.4 Refaktor `installation-service.ts::deleteMods` — rozwiązywanie do absolute przed `unlinkSync`.
- [x] 1.5 Refaktor `file-service.ts::copyFiles` — wpis relatywny. (boundary conversion zamiast źródłowej, patrz decyzja #3)
- [x] 1.6 Refaktor `configuration-service.ts::installedFilesExist` — rozwiązywanie do absolute.
- [x] 1.7 Refaktor `ini-service.ts::iniFilePath` lookup — porównanie po basename.
- [x] 1.8 Migracja w `loadConfiguration`: detekcja absolute → konwersja, wpisy spoza `gothicPath` → odrzucenie + log warning.
- [x] 1.9 Aktualizacja testów `tests/preload/installation-service.spec.ts` i `tests/preload/configuration-service.spec.ts` + ini-service.
- [x] 1.10 Test migracji starego configu (snapshot przed/po + idempotentność).
- [x] 1.11 Sprawdzenie `HomeView.vue` (reset filesCreated) — nie wymaga zmian (tylko `.length` i `= []`).
- [x] 1.12 Pełny `npm run test` zielony (130/130) + `tsc --noEmit` w preload bez błędów.

## Out of scope

- Zmiana zachowania UI po przeniesieniu gry (to Etap 2).
- Restrukturyzacja `filesCreated` na strukturę z metadanymi mod-id (out of scope, ewentualnie w przyszłości).

# Dziennik — Etap 1

## 2026-04-18 — start sesji
- Model: Claude Opus 4.7
- Stan startowy: plan rozpisany w `plan.md`, 0/12 kroków ukończonych.
- Decyzje 1–4 zatwierdzone (`decisions.md`): separator `/`, odrzucanie wpisów spoza `gothicPath` z log warningiem, konwersja na granicy zapisu/odczytu, brak sortowania.
- Zakres sesji: pełna realizacja kroków 1.1–1.12.

## 2026-04-18 — implementacja kroków 1.1–1.8
- Pliki: `packages/preload/src/services/file-service.ts` (helpery `toRelative`/`toAbsolute`), `packages/preload/src/services/installation-service.ts` (zapis relatywny w `installMods`, resolve abs w `deleteMods`), `packages/preload/src/services/configuration-service.ts` (`migrateFilesCreated`, `installedFilesExist` z `toAbsolute`), `packages/preload/src/services/ini-service.ts` (lookup po `path.basename` + resolve), `utils/messages.ts` (klucz `CONFIG_FILES_CREATED_DROPPED`).
- `HomeView.vue` bez zmian — operuje tylko na `.length` i `= []`.

## 2026-04-18 — testy (kroki 1.9, 1.10, 1.12)
- Pliki: `tests/preload/file-service.spec.ts` (nowy, 6 testów — helpery), `tests/preload/installation-service.spec.ts` (deleteMods przepisane na format relatywny + nowy test `persists relative paths in filesCreated` + nowy test `resolves relative paths against current gothicPath after the game folder moved`), `tests/preload/configuration-service.spec.ts` (5 nowych testów migracji: konwersja, odrzucenie, normalizacja, idempotentność, empty), `tests/preload/ini-service.spec.ts` (filesCreated zmienione na relatywne).
- Wynik: `npm run test` → **130 passed / 130 total**, 0 failed.
- `tsc --noEmit -p packages/preload` → brak błędów.
- `i18n`: dodany tylko klucz EN; pozostałe tłumaczenia (de/pl/ru) nie aktualizowane — jest to klucz wewnętrzny logger’a (nie UI), więc locale’e nie są wymagane. Por. `utils/messages.ts` (jednojęzyczny). Brak naruszenia konwencji `locales/`.

## 2026-04-18 — zakończenie sesji
- Wszystkie 12 kroków `plan.md` ukończone.
- Sugestia commit message: `feat(config): store filesCreated as paths relative to gothicPath with migration`
- Diff stat: 6 plików produkcyjnych zmienionych (`file-service.ts`, `installation-service.ts`, `configuration-service.ts`, `ini-service.ts`, `utils/messages.ts`), 4 pliki testowe (1 nowy, 3 zaktualizowane).

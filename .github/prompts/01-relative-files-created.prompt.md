---
mode: agent
description: Etap 1 - migracja `filesCreated` z absolutnych ścieżek na relatywne względem `gothicPath`
---

# Etap 1: `filesCreated` jako ścieżki relatywne

> **Historia realizacji**: [.sefaris/stages/01-relative-files-created/](../../.sefaris/stages/01-relative-files-created/progress.md) — czytaj `plan.md`, `decisions.md`, `agent-notes.md`, `tests.md` przed startem. Aktualizuj na bieżąco.
>
> **Tryb pracy**: użyj custom agent [Sefaris Stage Executor](../agents/sefaris-stage.agent.md).
>
> **Wymagania testowe**: [testing.instructions.md](../instructions/testing.instructions.md) — brak testów = krok nieukończony.

## Cel
Pole `filesCreated` w configu (`AppConfiguration`) trzyma absolutne ścieżki do plików utworzonych podczas instalacji modów. Po przeniesieniu folderu gry wszystkie wpisy są bezużyteczne. Zmień format na ścieżki relatywne względem `config.gothicPath`, z wsteczną kompatybilnością starych configów.

## Kontekst (pliki kluczowe)
- [interfaces/AppConfiguration.ts](../../interfaces/AppConfiguration.ts) — definicja pola `filesCreated: string[]`.
- [packages/preload/src/services/installation-service.ts](../../packages/preload/src/services/installation-service.ts) — funkcja `installMods` buduje `createdFiles` z absolutnych ścieżek docelowych; `deleteMods` iteruje po `config.filesCreated` i robi `fs.unlinkSync`.
- [packages/preload/src/services/file-service.ts](../../packages/preload/src/services/file-service.ts) — `copyFiles` wpisuje absolutne ścieżki do tablicy.
- [packages/preload/src/services/configuration-service.ts](../../packages/preload/src/services/configuration-service.ts) — `isValidConfiguration`, `installedFilesExist`, `loadConfiguration`, `saveConfiguration`.
- [packages/preload/src/services/ini-service.ts](../../packages/preload/src/services/ini-service.ts) — `config.filesCreated.find(file => file.includes(name))` jako lokalizator ini moda.
- [packages/renderer/src/views/HomeView.vue](../../packages/renderer/src/views/HomeView.vue) — reset `filesCreated` gdy fizycznie nie ma plików `.m*`.
- Testy: [tests/preload/installation-service.spec.ts](../../tests/preload/installation-service.spec.ts), [tests/preload/configuration-service.spec.ts](../../tests/preload/configuration-service.spec.ts).

## Wymagania
1. W `installation-service.ts` zamiast push'owania absolutnych ścieżek przechowuj ścieżki relatywne względem `gothicPath` (użyj `path.relative(gothicPath, absolutePath)`, znormalizuj separatory na `/` dla spójności cross-platform).
2. Wprowadź helper (np. w `file-service.ts`) `toRelative(gothicPath, absolutePath)` i `toAbsolute(gothicPath, relativePath)` używany w całej warstwie preload.
3. `deleteMods` w `installation-service.ts` musi rozwiązywać ścieżki przez `path.join(gothicPath, relative)` przed `unlinkSync`.
4. `installedFilesExist` w `configuration-service.ts` analogicznie.
5. `ini-service.ts` `iniFilePath = config.filesCreated.find(...)` — dopasuj wyszukiwanie do nowego formatu (porównuj `path.basename` lub koniec ścieżki).
6. **Migracja**: w `loadConfiguration` wykryj absolutne wpisy w `filesCreated` (np. `path.isAbsolute(entry)`) i automatycznie skonwertuj na relatywne, jeśli zaczynają się od aktualnego `gothicPath`. Jeśli nie zaczynają się od `gothicPath` — odrzuć je z konfiguracji (bezpieczna migracja, nic nie kasujemy z dysku w tym kroku).
7. Zaktualizuj/dopisz testy jednostkowe pokrywające: instalację (zapis relatywny), deinstalację (rozwiązanie ścieżki), migrację starego configu.
8. Zachowaj kompatybilność API IPC — z punktu widzenia renderera nic się nie zmienia.

## Akceptacja
- `npm run test` zielone.
- Po przeniesieniu folderu gry i ręcznej zmianie `gothicPath` w configu, lista `filesCreated` pozostaje sensowna (deinstalacja modów działa po nowej ścieżce).
- Stary config z absolutnymi ścieżkami ładuje się bez błędu i jest cicho zmigrowany przy najbliższym `saveConfiguration`.

# Plan: Etap 2 — Zachowanie configu przy zmianie ścieżki gry

## Kroki

- [x] 2.1 Wprowadzić nowy wariant błędu `ConfigurationError('INVALID_GAME_PATH')` w `Errors/ConfigurationError.ts` (z polem `config`).
- [x] 2.2 W `configuration-service.ts::loadConfiguration` rozdzielić walidację (struktura vs `gothicPath`); dodano `loadConfigurationRaw`.
- [x] 2.3 W `HomeView.vue::onMounted` obsłużyć nowy błąd: `ConfirmModal` z dwoma akcjami (zmień ścieżkę / anuluj).
- [x] 2.4 Po wybraniu nowej ścieżki — zachowanie reszty configu (`installedMods`, `filesCreated`, presety, ustawienia).
- [x] 2.5 Backup starego configu (`<config>.bak`) przed nadpisaniem przy ścieżce `INVALID_CONFIGURATION` (corrupted JSON / zła struktura).
- [x] 2.6 Klucze tłumaczeń `alert.gamePathInvalid` / `gamePathInvalidTitle` / `selectNewGameFolder` w `locales/{de,en,pl,ru}.ts`.
- [x] 2.7 Nowy `ConfirmModal.vue` zamiast modyfikacji `AlertModal.vue` (decyzja #1).
- [x] 2.8 Testy jednostkowe nowego wariantu i backupu w `configuration-service.spec.ts` (+14 testów).
- [ ] 2.9 Test komponentowy `HomeView.vue` flow → odłożone (decyzja #5: vue-test-utils nie jest zainstalowane; setup poza zakresem etapu).
- [ ] 2.10 Smoke manualny: zmiana folderu + sprawdzenie zachowania installedMods → do wykonania przez użytkownika po buildzie.

## Out of scope

- Auto-detekcja przeniesionej gry (np. po nazwie folderu). Tylko ręczne wskazanie.

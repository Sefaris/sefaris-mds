# Plan: Etap 2 — Zachowanie configu przy zmianie ścieżki gry

## Kroki

- [ ] 2.1 Wprowadzić nowy wariant błędu `ConfigurationError('INVALID_GAME_PATH')` w `Errors/ConfigurationError.ts`.
- [ ] 2.2 W `configuration-service.ts::loadConfiguration` rozdzielić walidację: zwróć surowy config + flagę `gamePathValid`.
- [ ] 2.3 W `HomeView.vue::onMounted` obsłużyć nowy błąd: alert z dwoma akcjami (zmień ścieżkę / anuluj).
- [ ] 2.4 Po wybraniu nowej ścieżki — merge ze starym configiem (zachować `installedMods`, `filesCreated`, presety).
- [ ] 2.5 Backup starego configu (`<config>.bak`) przed nadpisaniem przy świeżym configu (`INVALID_CONFIGURATION`).
- [ ] 2.6 Klucze tłumaczeń `alert.gamePathInvalid.*` w `locales/{de,en,pl,ru}.ts`.
- [ ] 2.7 Modyfikacja `AlertModal.vue` (jeśli wymaga obsługi 2 akcji + cancel).
- [ ] 2.8 Test jednostkowy nowego wariantu w `configuration-service.spec.ts`.
- [ ] 2.9 Test komponentowy `HomeView.vue` flow (mock IPC, mock alert).
- [ ] 2.10 Smoke manualny: zmiana folderu + sprawdzenie zachowania installedMods.

## Out of scope
- Auto-detekcja przeniesionej gry (np. po nazwie folderu). Tylko ręczne wskazanie.

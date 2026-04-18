# Dziennik — Etap 2

## 2026-04-18 — start sesji

- Model: Claude Opus 4.7
- Stan wejściowy: Etap 1 ukończony (`filesCreated` relatywne). Plan rozpisany w `plan.md`. Brak zmian w kodzie.
- Cel sesji: zrealizować kroki 2.1 – 2.10.

## 2026-04-18 13:35 — implementacja + testy

- Kroki: 2.1 – 2.8 (2.9/2.10 odłożone, patrz plan.md i decyzja #5).
- Pliki kodu (większość już zaimplementowana w poprzedniej sesji, w tej rundzie audyt + drobne poprawki):
  - `Errors/ConfigurationError.ts` — pole `config?: AppConfiguration`.
  - `packages/preload/src/services/configuration-service.ts` — `loadConfiguration` rozdziela `INVALID_GAME_PATH` (z payloadem) od `INVALID_CONFIGURATION`; `loadConfigurationRaw`; `backupConfiguration` (jednoslotowe `.bak`); backup wywoływany tylko przy strukturalnym błędzie / złym JSON-ie.
  - `packages/preload/src/index.ts` — eksport `loadConfigurationRaw`.
  - `packages/renderer/src/views/HomeView.vue` — flow recovery przez `ConfirmModal`; usunięto string-konkatenację ścieżki (`raw.modsPath = ''` → preload przelicza przez `path.join`); usunięto nieużywany import `MODS_DIRECTORY`.
  - `packages/renderer/src/components/ConfirmModal.vue` — nowy komponent.
  - `locales/{de,en,pl,ru}.ts` — `alert.gamePathInvalid`, `alert.gamePathInvalidTitle`, `alert.selectNewGameFolder` (4/4 języki).
  - `utils/messages.ts` — `INVALID_GAME_PATH`, `CONFIG_BACKUP_CREATED`, `CONFIG_BACKUP_FAILED`.
- Pliki testów:
  - `tests/preload/configuration-service.spec.ts` — +14 testów (3 nowe `describe`: `loadConfiguration error variants`, `loadConfigurationRaw`, `backupConfiguration`).
- Testy: `npm run test` → **156 passed** (z 142 przed etapem 2 → +14). `tsc --noEmit` preload + renderer: czysto.
- Notatki: `saveConfiguration` przelicza `modsPath` z `gothicPath`, więc renderer nie musi go składać ręcznie — usunięty z renderera string-concat zgodnie z konwencją `path.join`.

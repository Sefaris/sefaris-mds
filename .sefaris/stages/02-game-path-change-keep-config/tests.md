# Strategia testów — Etap 2

## Zakres

| Obszar | Plik | Status |
| --- | --- | --- |
| `INVALID_GAME_PATH` rzucany + payload | `tests/preload/configuration-service.spec.ts` | [x] |
| `loadConfigurationRaw` warianty | `tests/preload/configuration-service.spec.ts` | [x] |
| Backup `.bak` (warianty) | `tests/preload/configuration-service.spec.ts` | [x] |
| Flow HomeView | `tests/renderer/views/HomeView.spec.ts` (nowy) | [ ] (decyzja #5) |

## Scenariusze

### Happy path

- [ ] Config z błędną ścieżką → alert → user wybiera nową → config zachowany + nowy `gothicPath`.

### Edge cases

- [ ] User anuluje wybór → alert pozostaje, brak zmian w configu.
- [ ] User wybiera nieprawidłowy folder → ponowna walidacja w pętli.
- [ ] Config corrupted (zły JSON) → świeży config + backup oryginału.
- [ ] Stary config bez nowych pól → merge defaultami.

## Świadomie nieobjęte

- Test e2e dialogu Electron — mockujemy `dialog.showOpenDialog`.

## Wynik ostatniego runu

```
npm run test
Test Files  7 passed (7)
     Tests  156 passed (156)
  (configuration-service.spec.ts: 32 testy, w tym 14 nowych dla etapu 2)
```

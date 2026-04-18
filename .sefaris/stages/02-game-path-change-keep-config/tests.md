# Strategia testów — Etap 2

## Zakres

| Obszar | Plik | Status |
|---|---|---|
| `INVALID_GAME_PATH` rzucany | `tests/preload/configuration-service.spec.ts` | [ ] |
| Merge starego configu z nową ścieżką | `tests/preload/configuration-service.spec.ts` | [ ] |
| Backup `.bak` | `tests/preload/configuration-service.spec.ts` | [ ] |
| Flow HomeView | `tests/renderer/views/HomeView.spec.ts` (nowy) | [ ] |

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
(brak)
```

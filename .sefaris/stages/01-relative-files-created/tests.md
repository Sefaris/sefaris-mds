# Strategia testów — Etap 1

## Zakres pokrycia

| Obszar | Plik testowy | Status |
| --- | --- | --- |
| Helper `toRelative`/`toAbsolute` | `tests/preload/file-service.spec.ts` (nowy lub rozszerzenie) | [ ] |
| `installMods` zapis relatywny | `tests/preload/installation-service.spec.ts` | [ ] |
| `deleteMods` rozwiązywanie | `tests/preload/installation-service.spec.ts` | [ ] |
| `installedFilesExist` | `tests/preload/configuration-service.spec.ts` | [ ] |
| Migracja starego configu | `tests/preload/configuration-service.spec.ts` | [ ] |
| `ini-service` lookup | `tests/preload/ini-service.spec.ts` | [ ] |

## Scenariusze

### Happy path

- [ ] Instalacja moda → `filesCreated` zawiera ścieżki względne.
- [ ] Deinstalacja moda po zmianie `gothicPath` → pliki usuwane z nowej lokalizacji.

### Edge cases

- [ ] Pusty `filesCreated`.
- [ ] Wpis z `..` (próba ucieczki) — odrzucony przy migracji.
- [ ] Spacje i znaki UTF-8 w nazwach plików.
- [ ] `gothicPath` z trailing slash vs bez.

### Migracje

- [ ] Stary config (absolute) + ten sam `gothicPath` → konwersja do relative.
- [ ] Stary config (absolute) + zmieniony `gothicPath` → wpisy spoza odrzucone.
- [ ] Mieszany config (część abs, część rel) — idempotentność.
- [ ] Brak pola `filesCreated` → puste array.

### Cross-platform

- [ ] win32: separator `\` w configu vs odczyt `/`.
- [ ] linux: case-sensitive matching (wstęp do Etapu 3).

## Świadomie nieobjęte

- E2E z prawdziwą instalacją modów — wymaga środowiska z grą; smoke manualny zamiast tego.

## Wynik ostatniego runu

```
(brak)
```

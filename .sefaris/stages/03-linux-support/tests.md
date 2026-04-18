# Strategia testów — Etap 3

## Zakres

| Obszar                            | Plik                                          | Status |
| --------------------------------- | --------------------------------------------- | ------ |
| `resolveCaseInsensitive`          | `tests/preload/file-service.spec.ts`          | [ ]    |
| `getDocumentsPath` cross-platform | `tests/preload/file-service.spec.ts`          | [ ]    |
| `isGothicPathValid` casing        | `tests/preload/configuration-service.spec.ts` | [ ]    |
| Migracja `savesPath`              | `tests/preload/configuration-service.spec.ts` | [ ]    |
| `pak-service` wine detection      | `tests/preload/pak-service.spec.ts` (nowy)    | [ ]    |

## Scenariusze

### Happy path

- [ ] Win32: walidacja `Gothic3.exe` działa jak wcześniej.
- [ ] Linux: walidacja `gothic3.exe` / `GOTHIC3.EXE` przechodzi.
- [ ] Linux: `getDocumentsPath` zwraca XDG / fallback.
- [ ] User wskazuje custom `savesPath` → zapisany w configu.

### Edge cases

- [ ] `resolveCaseInsensitive` z brakującym segmentem → zwraca null.
- [ ] `resolveCaseInsensitive` ze ścieżką poza `basePath` → null.
- [ ] Linux bez wine + próba użycia G3Pak → `InstallationError` z czytelnym komunikatem.
- [ ] Migracja: stary config bez `savesPath` → autodetect.

### Cross-platform

- [ ] win32: fast-path bez skanowania readdir.
- [ ] linux: pełny skan z dopasowaniem case-insensitive.
- [ ] mock `process.platform` przez `vi.stubGlobal`.

## Świadomie nieobjęte

- E2E na realnym Linuksie — manualny smoke.
- macOS — out of scope.

## Wynik ostatniego runu

```
(brak)
```

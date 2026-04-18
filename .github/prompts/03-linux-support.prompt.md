---
mode: agent
description: Etap 3 - natywne wsparcie dla Linuksa (case-insensitive paths, ręczny wybór folderu sejwów)
---

# Etap 3: Wsparcie Linuksa

> **Historia realizacji**: [.sefaris/stages/03-linux-support/](../../.sefaris/stages/03-linux-support/progress.md).
>
> **Tryb pracy**: custom agent [Sefaris Stage Executor](../agents/sefaris-stage.agent.md).
>
> **Wymagania testowe**: [testing.instructions.md](../instructions/testing.instructions.md).

## Cel
Aplikacja jest obecnie de facto windowsowa. Dodaj wsparcie Linuksa: case-insensitive resolwowanie ścieżek do plików gry oraz możliwość ręcznego wskazania folderu z sejwami / `Documents/gothic3` (Wine, Proton compatdata, niestandardowe lokalizacje).

## Kontekst
- [packages/preload/src/services/file-service.ts](../../packages/preload/src/services/file-service.ts) — `getDocumentsPath()` używa `Winreg` (Windows-only); `openFolder()` używa `explorer`.
- [packages/preload/src/services/configuration-service.ts](../../packages/preload/src/services/configuration-service.ts) — `isGothicPathValid` szuka literalnie `'Gothic3.exe'`.
- [packages/main/src/events.ts](../../packages/main/src/events.ts) — sprawdza `'gothic3.exe'` (lowercase) — niespójność z preload.
- [packages/preload/src/services/installation-service.ts](../../packages/preload/src/services/installation-service.ts) — twarde nazwy `Data`, `scripts`, `ini`, `Static`, `G3_World_01.wrldatasc`, `Projects_compiled.m0x/n0x`, ścieżki sejwów `<Documents>/gothic3`.
- [packages/preload/src/services/pak-service.ts](../../packages/preload/src/services/pak-service.ts) — `Tools/G3Pak/G3Pak.exe`, `execFile` z `shell: true`, hardcoded backslash.
- [packages/preload/src/services/ini-service.ts](../../packages/preload/src/services/ini-service.ts) — nazwy folderów lowercase.
- [interfaces/AppConfiguration.ts](../../interfaces/AppConfiguration.ts) — dorzuć opcjonalne `savesPath?: string`.
- [packages/renderer/src/views/](../../packages/renderer/src/views) — UI ustawień startera (gdzie dodać pole „Folder sejwów”).

## Wymagania
1. **Helper case-insensitive** w `file-service.ts`:
   - `resolveCaseInsensitive(basePath, segments[]): string | null` — przechodzi po segmentach, na każdym poziomie listuje `fs.readdirSync` i dopasowuje case-insensitive. Na Windowsie skrót: zwraca `path.join(...)` bez kosztownego skanowania.
   - Użyj go wszędzie gdzie buduje się ścieżki do plików gry (Data, scripts, ini, Static, Gothic3.exe, save'y).
2. **Cross-platform `getDocumentsPath()`**:
   - Windows: dotychczasowy `Winreg`.
   - Linux: `app.getPath('documents')` (Electron) lub `$XDG_DOCUMENTS_DIR` / fallback `~/Documents`.
   - macOS pomijamy (out of scope), ale nie crashuj.
3. **`openFolder()` cross-platform**: użyj `shell.openPath()` z Electron zamiast `exec('explorer ...')`.
4. **`isGothicPathValid`**: użyj nowego helpera case-insensitive zamiast literału `'Gothic3.exe'`. Ujednolić casing w `events.ts` i `configuration-service.ts`.
5. **`pak-service.ts`**: 
   - Detekcja platformy: na Linuksie wymagaj `wine` (`Tools/G3Pak/G3Pak.exe` przez `wine`) lub natywnego portu jeśli istnieje. Brak wine → czytelny `InstallationError`.
   - `path.join` zamiast hardcoded `\\`.
   - `shell: true` tylko na Windowsie.
6. **Folder sejwów konfigurowalny**:
   - Dodaj pole `savesPath?: string` do `AppConfiguration` (opcjonalne, domyślnie auto-detect przez `getDocumentsPath() + '/gothic3'` z resolverem case-insensitive).
   - W UI startera (okno konfiguracji — patrz `packages/main/src/configWindow.ts` i odpowiednia view): dodaj pole „Folder sejwów” z przyciskiem wyboru folderu (IPC analogiczny do `open-folder-dialog-game`).
   - W `installation-service.ts` używaj `config.savesPath ?? autoDetectedSavesPath`.
7. **Testy**: nie wymagamy uruchamiania na Linuksie w CI, ale pokryj `resolveCaseInsensitive` i fallback `getDocumentsPath` testami z mockiem `process.platform`.
8. Zaktualizuj [README.md](../../README.md) o sekcję „Linux” (wymagania: wine dla G3Pak, ręczne wskazanie save'ów dla Proton).

## Akceptacja
- Aplikacja startuje na Linuksie i loguje sensowne ostrzeżenia jeśli brakuje narzędzi.
- Walidacja ścieżki gry działa niezależnie od casing (`gothic3.exe` / `Gothic3.exe` / `GOTHIC3.EXE`).
- User może w ustawieniach wskazać własny folder sejwów; zapis trafia do configu.
- Windows nadal działa identycznie jak wcześniej (regresji brak — uruchom `npm run test`).

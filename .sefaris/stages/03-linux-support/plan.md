# Plan: Etap 3 — Wsparcie Linuksa

## Kroki

- [ ] 3.1 Helper `resolveCaseInsensitive(basePath, segments)` w `file-service.ts` z fast-pathem dla `win32`.
- [ ] 3.2 Cross-platform `getDocumentsPath()` (Winreg na Win, `app.getPath('documents')` / XDG na Linux).
- [ ] 3.3 Cross-platform `openFolder()` przez `shell.openPath()`.
- [ ] 3.4 `isGothicPathValid` przez `resolveCaseInsensitive` zamiast literału.
- [ ] 3.5 Ujednolicenie casing w `events.ts` i `configuration-service.ts` (`gothic3.exe` lookup).
- [ ] 3.6 `pak-service.ts`: detekcja `wine` na Linuksie + czytelny `InstallationError` przy braku.
- [ ] 3.7 `pak-service.ts`: `path.join` zamiast `\\`, `shell: true` tylko na win32.
- [ ] 3.8 Pole `savesPath?: string` w `interfaces/AppConfiguration.ts` + migracja (default = autodetect).
- [ ] 3.9 IPC `open-folder-dialog-saves` w `events.ts` (analogicznie do game).
- [ ] 3.10 UI w oknie konfiguracji startera (`configWindow.ts` + odpowiednia view) — pole „Folder sejwów”.
- [ ] 3.11 `installation-service.ts` używa `config.savesPath ?? autodetect`.
- [ ] 3.12 Klucze tłumaczeń (4 języki) dla nowego pola i błędów.
- [ ] 3.13 Testy: `resolveCaseInsensitive`, `getDocumentsPath` (mock platform), `isGothicPathValid`, migracja `savesPath`.
- [ ] 3.14 Aktualizacja `README.md` — sekcja Linux (wymagania wine, Proton compatdata).
- [ ] 3.15 Smoke manualny na Linuksie (jeśli środowisko dostępne) lub WSL.

## Out of scope

- Natywny port G3Pak na Linuksa.
- macOS.
- Auto-detekcja Proton compatdata (user wskazuje ręcznie).

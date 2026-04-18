---
mode: agent
description: Etap 2 - przy nieprawidłowej ścieżce do gry zaproponuj zmianę ścieżki zamiast czyścić config
---

# Etap 2: Zachowanie configu przy zmianie lokalizacji gry

> **Historia realizacji**: [.sefaris/stages/02-game-path-change-keep-config/](../../.sefaris/stages/02-game-path-change-keep-config/progress.md).
>
> **Tryb pracy**: custom agent [Sefaris Stage Executor](../agents/sefaris-stage.agent.md).
>
> **Wymagania testowe**: [testing.instructions.md](../instructions/testing.instructions.md).

## Problem
Gdy folder gry zostanie przeniesiony i `gothicPath` w configu jest nieaktualny, `loadConfiguration` rzuca `ConfigurationError('INVALID_CONFIGURATION')`. `HomeView.vue` interpretuje to jako brak configu i tworzy świeży, kasując `filesCreated`, `installedMods`, ustawienia presetów itd.

## Kontekst
- [packages/preload/src/services/configuration-service.ts](../../packages/preload/src/services/configuration-service.ts) — `loadConfiguration`, `isValidConfiguration`, `isGothicPathValid`.
- [Errors/ConfigurationError.ts](../../Errors/ConfigurationError.ts) — typ błędu.
- [packages/renderer/src/views/HomeView.vue](../../packages/renderer/src/views/HomeView.vue) — `onMounted`, obsługa `selectGameFolder`, alerty `alert.configNotFound`/`alert.modFilesNotFound`.
- [packages/main/src/events.ts](../../packages/main/src/events.ts) — `open-folder-dialog-game` (walidacja `gothic3.exe`).
- [locales/*.ts](../../locales) — klucze alertów (dodaj nowy klucz np. `alert.gamePathInvalid`).
- [types/AlertType.ts](../../types/AlertType.ts) — typy alertów (jeśli enumeryczne).
- [packages/preload/src/services/alert-service.ts](../../packages/preload/src/services/alert-service.ts) — service alertów.

## Wymagania
1. Rozróżnij w `configuration-service` przypadki błędnego configu:
   - config istnieje, JSON parsowalny, ale `gothicPath` nieprawidłowy → nowy błąd `ConfigurationError('INVALID_GAME_PATH')` z polem przenoszącym aktualny config (lub osobna metoda `loadConfigurationRaw()` zwracająca surowe dane bez walidacji `gothicPath`).
   - config nie istnieje / niepoprawna struktura → dotychczasowy `INVALID_CONFIGURATION`.
2. W `HomeView.vue` obsłuż nowy błąd:
   - Pokaż alert z dwoma akcjami: „Wybierz nową lokalizację gry” i „Anuluj/Zamknij”.
   - Po wyborze nowej ścieżki: zaktualizuj `config.gothicPath`, zachowaj resztę pól (`installedMods`, `filesCreated`, presety, ustawienia).
   - Po migracji z Etapu 1 (`filesCreated` relatywne) ścieżki działają od razu pod nową lokalizacją.
3. Dodaj nowe klucze tłumaczeń w [locales/de.ts](../../locales/de.ts), [locales/en.ts](../../locales/en.ts), [locales/pl.ts](../../locales/pl.ts), [locales/ru.ts](../../locales/ru.ts).
4. Nie wywołuj automatycznie `closeApplication()` jeśli user świadomie wybrał „zachowaj config” a anulował dialog wyboru ścieżki — pozwól ponowić.
5. Przed nadpisaniem configu (np. utworzenie świeżego) zrób kopię zapasową starego pliku (np. `<config>.bak`).

## Akceptacja
- Przeniesienie folderu gry i wskazanie nowej lokalizacji nie powoduje utraty `installedMods`/presetów/`filesCreated`.
- Stary brak configu/uszkodzony JSON nadal prowadzi do dotychczasowego flow (świeży config).
- Tłumaczenia dostępne we wszystkich 4 językach.
- Testy jednostkowe pokrywają nowy wariant błędu.

---
applyTo: '**'
---

# Konwencje projektu sefaris-mds

## Architektura
- **packages/main** — proces główny Electron, IPC, okna.
- **packages/preload** — bridge, services (logika biznesowa: fs, config, mods, ini, pak).
- **packages/renderer** — Vue 3 + Pinia + Tailwind + Vue Router.
- **interfaces/** — DTO współdzielone między warstwami.
- **types/** — typy pomocnicze i enumy.
- **Errors/** — własne klasy błędów (rzucane z preload, łapane w renderer).
- **locales/** — i18n (de/en/pl/ru), wszystkie 4 muszą być uzupełnione przy nowych kluczach.

## Reguły implementacyjne
- Logika fs / OS — wyłącznie w `packages/preload/src/services/*`. Renderer nigdy nie dotyka `fs`.
- Każdy nowy IPC handler — typowany w `packages/preload/src/exposed.ts`.
- Ścieżki — używaj `path.join` / `path.relative`, nigdy konkatenacji stringów.
- Cross-platform — sprawdź czy nie używasz Windows-only API (Winreg, `explorer`, `.exe`); jeśli tak — branch po `process.platform`.

## Styl
- TS strict, brak `any` bez komentarza wyjaśniającego.
- Funkcje > 40 linii — rozważ podział.
- Vue: Composition API + `<script setup lang="ts">`.
- Tailwind: preferuj utility classes; własne CSS tylko gdy konieczne.

## Co NIE robić
- Nie dodawaj zależności bez wpisu w `decisions.md`.
- Nie zmieniaj struktury folderów bez ustalenia.
- Nie refaktoryzuj „przy okazji” poza zakresem etapu.
- Nie dodawaj komentarzy / docstringów do kodu którego nie zmieniasz.

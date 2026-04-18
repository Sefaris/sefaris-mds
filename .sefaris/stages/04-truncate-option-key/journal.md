# Dziennik — Etap 4

## 2026-04-18

- Dodano prop `truncate` (default `true`) do `ConfigTooltip.vue` oraz klasy `inline-block max-w-[240px] truncate align-bottom` i `:title="name"` na elemencie z nazwą klucza.
- Drugi konsument (`StarterOptionsView.vue`) działa dalej bez zmian — przekazuje krótkie etykiety i18n.
- Vitest root config (`vitest.config.js`) rozszerzony o `@vitejs/plugin-vue`, by można było mountować komponenty `.vue` w testach komponentowych.
- Nowy plik `tests/renderer/components/ConfigTooltip.spec.ts` (4 scenariusze) — wszystkie zielone.

## 2026-04-18 — refactor responsywny

- Zmieniono podejście na responsywne: root `ConfigTooltip` `min-w-0 flex-1 overflow-hidden`, span `block truncate` (bez sztywnego `max-w`).
- `DisplayBaseOption`: dodano `gap-4` i opakowano slot w `<div class="shrink-0">`, dzięki czemu wartość po prawej nie kurczy się, a obcięcie reaguje na szerokość okna.
- Testy zaktualizowane: sprawdzają obecność `truncate`/`block` na spanie i `min-w-0`/`flex-1` na roście.

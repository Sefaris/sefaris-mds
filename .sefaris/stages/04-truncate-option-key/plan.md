# Plan: Etap 4 — Truncate klucza opcji

## Kroki

- [x] 4.1 Sprawdzić aktualny render `ConfigTooltip.vue` i `DisplayBaseOption.vue`.
- [x] 4.2 Dodać prop `truncate?: boolean` (default `true`) do `ConfigTooltip.vue`.
- [x] 4.3 Klasy Tailwind: `truncate max-w-[Xpx] inline-block` + `:title="name"`.
- [x] 4.4 Dobrać `max-w` empirycznie (sprawdzić w widoku z DisplayStringOption).
- [x] 4.5 Test komponentowy `ConfigTooltip.spec.ts` — smoke + obecność `title`.
- [x] 4.6 Wizualna weryfikacja na długim kluczu.

## Out of scope

- Pretty-printing klucza (split camelCase, i18n nazw kluczy).

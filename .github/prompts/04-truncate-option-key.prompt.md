---
mode: agent
description: Etap 4 - skrócenie wyświetlanej nazwy klucza opcji + pełna nazwa w title
---

# Etap 4: Truncate klucza opcji

> **Historia realizacji**: [.sefaris/stages/04-truncate-option-key/](../../.sefaris/stages/04-truncate-option-key/progress.md).
>
> **Tryb pracy**: custom agent [Sefaris Stage Executor](../agents/sefaris-stage.agent.md).
>
> **Wymagania testowe**: [testing.instructions.md](../instructions/testing.instructions.md).

## Problem
W widoku opcji konfiguracji wyświetlana jest pełna, długa nazwa klucza ini, która rozjeżdża layout. Należy ograniczyć długość wyświetlanego tekstu (CSS truncate) i pokazać pełną nazwę w `title` (tooltip natywny lub własny) po najechaniu.

## Kontekst
- [packages/renderer/src/components/DisplayOptions/DisplayBaseOption.vue](../../packages/renderer/src/components/DisplayOptions/DisplayBaseOption.vue) — wspólny wrapper renderujący `ConfigTooltip :name="option.name"`.
- [packages/renderer/src/components/ConfigTooltip.vue](../../packages/renderer/src/components/ConfigTooltip.vue) — renderuje surową nazwę klucza.
- [packages/renderer/src/components/DisplayOptions/](../../packages/renderer/src/components/DisplayOptions) — wszystkie warianty (`DisplayStringOption`, `DisplayBooleanOption`, `DisplayNumberOption`, `DisplayKeyOption`, `DisplayModeOption`, `DisplayArray*`).
- [interfaces/ConfigOption.ts](../../interfaces/ConfigOption.ts) — pole `name`.

## Wymagania
1. W `ConfigTooltip.vue` (lub w miejscu gdzie renderowana jest sama nazwa klucza w `DisplayBaseOption`):
   - Element zawierający `name` ma klasy Tailwind: `truncate max-w-[<rozsądna wartość, np. 20ch / 240px>] inline-block` (dobierz wartość pasującą do layoutu — sprawdź obecny CSS).
   - Atrybut `:title="option.name"` żeby natywny tooltip pokazywał pełną wartość.
2. Nie zmieniaj wartości `option.name` — tylko prezentacja.
3. Sprawdź czy `ConfigTooltip` jest używany też w innych kontekstach niż `DisplayBaseOption` — zachowaj wsteczną kompatybilność (np. prop `truncate?: boolean` z domyślnie `true`, by wyłączyć w razie potrzeby).
4. Wizualnie zweryfikuj na typowo długim kluczu (np. otwórz `DisplayStringOption.vue` w widoku).
5. Brak nowych testów wymaganych — zmiana czysto prezentacyjna.

## Akceptacja
- Długie klucze nie rozpychają layoutu.
- Po najechaniu kursorem widać pełną nazwę.
- Krótkie klucze wyglądają jak wcześniej.

# Strategia testów — Etap 5

## Zakres

| Obszar | Plik | Status |
| --- | --- | --- |
| `groupedMods` computed | `tests/renderer/stores/mods-store.spec.ts` (nowy) | [x] |
| `toggleCategoryExpanded` | `tests/renderer/stores/mods-store.spec.ts` | [x] |
| Filtr `all`/`installed` w grouped | `tests/renderer/stores/mods-store.spec.ts` | [x] |
| `expandAll` / `collapseAll` | `tests/renderer/stores/mods-store.spec.ts` | [x] |
| `GroupedModList` render | `tests/renderer/components/GroupedModList.spec.ts` (nowy) | [x] |
| Migracja `uiPreferences` | `tests/preload/configuration-service.spec.ts` | [x] |

## Scenariusze

### Happy path

- [x] `groupedMods` grupuje po `category`, sortowanie alfabetyczne.
- [x] `toggleCategoryExpanded` zmienia stan w `expandedCategories`.
- [x] Filtr `query` zawęża wyniki w obu trybach.
- [x] Filtr `installed` działa również w trybie grouped.
- [x] Akcje `expandAll` / `collapseAll` ustawiają stan wszystkich widocznych sekcji.

### Edge cases

- [x] Mody bez `category` → grupa „Inne” / „Uncategorized”.
- [x] Pusty wynik query → puste sekcje ukryte.
- [x] Wszystkie kategorie zwinięte → render samych nagłówków.

### Migracje

- [x] Brak `uiPreferences` w starym configu → default `'flat'`.

## Wynik ostatniego runu

```
npm run test

Test Files  13 passed (13)
Tests      199 passed (199)
Duration   835ms
```

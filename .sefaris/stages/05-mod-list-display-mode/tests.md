# Strategia testów — Etap 5

## Zakres

| Obszar                   | Plik                                                      | Status |
| ------------------------ | --------------------------------------------------------- | ------ |
| `groupedMods` computed   | `tests/renderer/stores/mods-store.spec.ts` (nowy)         | [ ]    |
| `toggleCategoryExpanded` | `tests/renderer/stores/mods-store.spec.ts`                | [ ]    |
| `GroupedModList` render  | `tests/renderer/components/GroupedModList.spec.ts` (nowy) | [ ]    |
| Migracja `uiPreferences` | `tests/preload/configuration-service.spec.ts`             | [ ]    |

## Scenariusze

### Happy path

- [ ] `groupedMods` grupuje po `category`, sortowanie alfabetyczne.
- [ ] `toggleCategoryExpanded` zmienia stan w `expandedCategories`.
- [ ] Filtr `query` zawęża wyniki w obu trybach.

### Edge cases

- [ ] Mody bez `category` → grupa „Inne” / „Uncategorized”.
- [ ] Pusty wynik query → puste sekcje ukryte.
- [ ] Wszystkie kategorie zwinięte → render samych nagłówków.

### Migracje

- [ ] Brak `uiPreferences` w starym configu → default `'flat'`.

## Wynik ostatniego runu

```
(brak)
```

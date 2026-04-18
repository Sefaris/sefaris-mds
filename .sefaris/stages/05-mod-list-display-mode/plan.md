# Plan: Etap 5 — Dwa tryby listy modów

## Kroki

- [x] 5.1 Dodać `uiPreferences.modListMode: 'flat' | 'grouped'` w `interfaces/AppConfiguration.ts` (default `'flat'`).
- [x] 5.2 Migracja w `loadConfiguration` (brak pola → default).
- [x] 5.3 Store `mods-store.ts`: computed `groupedMods` (Record<category, Mod[]>) — filtr po `query`, bez filtra `activeCategory`.
- [x] 5.4 Store: stan `expandedCategories: Set<string>` + akcja `toggleCategoryExpanded`.
- [x] 5.5 Inicjalizacja `expandedCategories` po `loadCategories` (wszystkie rozwinięte).
- [x] 5.6 Komponent `GroupedModList.vue` — sekcje per kategoria z chevronami.
- [x] 5.7 `MainSection.vue`: switch między `flat` (obecny) a `grouped`.
- [x] 5.8 `NavBar.vue`: ukrycie/wyszarzenie przycisków kategorii w trybie `grouped`.
- [x] 5.9 UI w oknie konfiguracji startera — select „Tryb listy modów”.
- [x] 5.10 Klucze tłumaczeń (4 języki).
- [x] 5.11 Testy store: `groupedMods`, `toggleCategoryExpanded`, `expandedCategories` init.
- [x] 5.12 Test komponentowy `GroupedModList`.
- [x] 5.13 Smoke manualny: przełączenie trybu, filtrowanie query w obu trybach.

## Out of scope

- Drag & drop kolejności modów.
- Custom sortowanie kategorii (alfabetyczne wystarczy).

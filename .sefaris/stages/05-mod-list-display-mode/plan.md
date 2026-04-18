# Plan: Etap 5 — Dwa tryby listy modów

## Kroki

- [ ] 5.1 Dodać `uiPreferences.modListMode: 'flat' | 'grouped'` w `interfaces/AppConfiguration.ts` (default `'flat'`).
- [ ] 5.2 Migracja w `loadConfiguration` (brak pola → default).
- [ ] 5.3 Store `mods-store.ts`: computed `groupedMods` (Record<category, Mod[]>) — filtr po `query`, bez filtra `activeCategory`.
- [ ] 5.4 Store: stan `expandedCategories: Set<string>` + akcja `toggleCategoryExpanded`.
- [ ] 5.5 Inicjalizacja `expandedCategories` po `loadCategories` (wszystkie rozwinięte).
- [ ] 5.6 Komponent `GroupedModList.vue` — sekcje per kategoria z chevronami.
- [ ] 5.7 `MainSection.vue`: switch między `flat` (obecny) a `grouped`.
- [ ] 5.8 `NavBar.vue`: ukrycie/wyszarzenie przycisków kategorii w trybie `grouped`.
- [ ] 5.9 UI w oknie konfiguracji startera — select „Tryb listy modów”.
- [ ] 5.10 Klucze tłumaczeń (4 języki).
- [ ] 5.11 Testy store: `groupedMods`, `toggleCategoryExpanded`, `expandedCategories` init.
- [ ] 5.12 Test komponentowy `GroupedModList`.
- [ ] 5.13 Smoke manualny: przełączenie trybu, filtrowanie query w obu trybach.

## Out of scope
- Drag & drop kolejności modów.
- Custom sortowanie kategorii (alfabetyczne wystarczy).

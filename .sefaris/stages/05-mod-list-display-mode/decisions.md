# Decyzje — Etap 5

## 1. NavBar w trybie `grouped`

- Data: 2026-04-18
- Kontekst: prompt mówi „ukryj/wyszarzaj przyciski kategorii (zostaw tylko `all`/`installed` lub całkowicie ukryj — do decyzji UX, zaproponuj sensowny default)”. `groupedMods` celowo ignoruje `activeCategory`, więc przyciski `all`/`installed` byłyby zwodnicze (zawsze wszystko jest widoczne).
- Opcje:
  1. Hide kompletnie cały rząd przycisków (`all`/`installed`/dropdown kategorii). Zostać tylko `presets-dropdown`.
  2. Zostawić `all`/`installed`, dropdown kategorii ukryć.
  3. Wyszarzyć wszystko (disabled).
- Wybór: **1** — komentarz w `NavBar.vue` wyjaśnia, że w trybie `grouped` filtrowanie odbywa się przez nagłówki sekcji + pole wyszukiwania. Presety zostają, bo nadal mają sens.
- Konsekwencje: użytkownik w trybie `grouped` nie ma szybkiego filtra „tylko zainstalowane” — jeśli pojawi się taka potrzeba, można w przyszłości dodać osobny toggle.

## 2. Persystencja `expandedCategories`

- Data: 2026-04-18
- Kontekst: czy pamiętać między restartami, które sekcje user zwinął?
- Opcje: persystować w `AppConfiguration.uiPreferences` / trzymać w pamięci.
- Wybór: **w pamięci**, default = wszystkie rozwinięte przy starcie (`loadCategories`).
- Konsekwencje: prościej, mniej migracji configu. Persystencję można dodać później.

## 3. Sortowanie kategorii w trybie `grouped`

- Data: 2026-04-18
- Kontekst: kolejność grup w `groupedMods`.
- Opcje: alfabetycznie / kolejność wystąpienia / custom.
- Wybór: **alfabetycznie (locale-aware, case-insensitive)**.
- Konsekwencje: stabilna, przewidywalna UX.

## 4. Walidacja `uiPreferences` w configu

- Data: 2026-04-18
- Kontekst: dodanie nowego opcjonalnego pola do `AppConfiguration` wymaga rozszerzenia `isValidConfigurationStructure`.
- Wybór: dodaję `'uiPreferences'` do `optionalKeys`. Jeśli obecne — wymagam `{ modListMode: 'flat' | 'grouped' }`. Brak pola → migracja w `loadConfiguration` wstawia default `{ modListMode: 'flat' }`.
- Konsekwencje: stare configi pozostają poprawne; po pierwszym `saveConfiguration` zostaną zapisane z polem.

## 5. Korekta UX po feedbacku użytkownika

- Data: 2026-04-18
- Kontekst: użytkownik zgłosił potrzebę zachowania filtrów `all`/`installed` także w trybie `grouped` i dodał wymaganie „rozwiń wszystkie / zwiń wszystkie”.
- Wybór:
  - W `NavBar` zostają widoczne przyciski `all`/`installed` w obu trybach.
  - Dropdown kategorii pozostaje tylko w trybie `flat`, żeby nie dublować filtrowania kategoriami.
  - `groupedMods` filtruje źródło po `activeCategory` tylko dla `installed`; w pozostałych przypadkach pokazuje wszystkie mody.
  - Dodano akcje store: `expandAllCategories` i `collapseAllCategories` + przyciski w toolbarze listy modów.
- Konsekwencje: grouped ma pełny workflow podglądu „wszystkie vs zainstalowane” i szybką kontrolę stanu sekcji.

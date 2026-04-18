---
mode: agent
description: Etap 5 - dwa tryby wyświetlania listy modów (przypięte kategorie vs grupowanie inline)
---

# Etap 5: Dwa tryby widoku listy modów

> **Historia realizacji**: [.sefaris/stages/05-mod-list-display-mode/](../../.sefaris/stages/05-mod-list-display-mode/progress.md).
>
> **Tryb pracy**: custom agent [Sefaris Stage Executor](../agents/sefaris-stage.agent.md).
>
> **Wymagania testowe**: [testing.instructions.md](../instructions/testing.instructions.md).

## Cel
Domyślnie zachować obecny styl: kategorie jako przyciski w `NavBar` + płaska lista modów. Dodać drugi tryb (do wyboru w ustawieniach startera): kategorie wyświetlane bezpośrednio w liście modów jako rozwijane sekcje (domyślnie rozwinięte).

## Kontekst
- [packages/renderer/src/stores/mods-store.ts](../../packages/renderer/src/stores/mods-store.ts) — `mods`, `categories`, `activeCategory`, `displayedMods`, `query`.
- [packages/renderer/src/components/NavBar.vue](../../packages/renderer/src/components/NavBar.vue) — przyciski kategorii + dropdown.
- [packages/renderer/src/components/MainSection.vue](../../packages/renderer/src/components/MainSection.vue) — renderuje listę przez `<mod-item v-for="mod in displayedMods">`.
- [packages/renderer/src/components/ModItem.vue](../../packages/renderer/src/components/ModItem.vue) — wiersz moda.
- [interfaces/AppConfiguration.ts](../../interfaces/AppConfiguration.ts) — dodać preferencje UI.
- [packages/main/src/configWindow.ts](../../packages/main/src/configWindow.ts) + odpowiednia view okna konfiguracji startera — miejsce na nowy toggle.
- [locales/*.ts](../../locales) — klucze tłumaczeń.

## Wymagania
1. **Model**: dodaj do `AppConfiguration` pole np. `uiPreferences: { modListMode: 'flat' | 'grouped' }` (z domyślnym `'flat'`). Migracja wsteczna: brak pola → `'flat'`.
2. **Store**:
   - Wystaw computed `groupedMods`: `Record<categoryName, Mod[]>` zbudowane z `displayedMods` (po filtrze `query`, ale **bez** filtra `activeCategory`, bo w trybie grouped wszystkie kategorie są widoczne).
   - Dodaj stan `expandedCategories: Set<string>` (domyślnie wszystkie kategorie rozwinięte przy ładowaniu).
   - Akcja `toggleCategoryExpanded(name)`.
3. **Komponent grupowanej listy**: nowy `GroupedModList.vue` (lub w `MainSection.vue` `v-if="modListMode === 'grouped'"`):
   - Iteracja po `groupedMods`; każda sekcja: nagłówek z nazwą kategorii + counter + chevron, pod spodem `<mod-item>` per mod.
   - Klik w nagłówek → `toggleCategoryExpanded`.
4. **NavBar w trybie grouped**: ukryj/wyszarzaj przyciski kategorii (zostaw tylko `all`/`installed` lub całkowicie ukryj — do decyzji UX, zaproponuj sensowny default i pozostaw komentarz). Na pewno nie powinny dublować funkcji.
5. **Ustawienie w UI konfiguracji**: dodaj toggle/select „Tryb listy modów” z opcjami „Płaska lista (z kategoriami w pasku)” / „Grupowana po kategoriach”. Po zmianie zapisuje się do configu i propagowane przez store.
6. **Tłumaczenia**: nowe klucze w 4 lokalach.
7. **Testy**: pokrycie computed `groupedMods` (sortowanie, pusty wynik, filtrowanie po `query`), `toggleCategoryExpanded`.
8. **Stylistyka**: spójna z resztą aplikacji (Tailwind, ikony — sprawdź jakie są używane w projekcie, np. `assets/svg`).

## Akceptacja
- Domyślnie wszystko wygląda jak dotychczas.
- Po przełączeniu w configu na „grouped” lista pokazuje wszystkie kategorie jako rozwinięte sekcje, z możliwością zwijania.
- Filtr `query` działa w obu trybach.
- `npm run test` zielone.

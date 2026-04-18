# Notatki agenta — Etap 5

## Założenia

- Niezależny od Etap 1-3, ale dotyka `AppConfiguration` — najlepiej po Etap 1, by uniknąć konfliktów migracji.

## Znaleziska

- `mods-store.displayedMods` jest jedynym miejscem filtrowania — łatwo dodać równoległe `groupedMods`.
- `NavBar.vue` ma hardcoded przyciski `all`/`installed` + dynamiczny dropdown — switching trybu wymaga `v-if`.

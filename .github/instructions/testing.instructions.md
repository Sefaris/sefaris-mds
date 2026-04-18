---
applyTo: '**'
---

# Wymagania testowe

Każda zmiana funkcjonalna w kodzie **musi** mieć pokrycie testami. Brak testów = niezakończony krok planu.

## Stack testowy
- Runner: **Vitest** (`vitest.config.js`).
- Lokalizacja: `tests/<obszar>/<nazwa>.spec.ts` (analogicznie do `tests/preload/`).
- Komenda: `npm run test` (lub `npx vitest run --coverage` dla pokrycia).

## Co testować

### Warstwa preload (services)
- **Zawsze** testy jednostkowe dla każdej publicznej funkcji service'u.
- Mockuj `fs`, `path` zachowania platformowe, `Winreg`, `child_process`.
- Pokryj: happy path, błąd I/O, edge cases (puste tablice, brakujące pliki, niepoprawny JSON), migrację formatów.

### Warstwa main
- Testy IPC handlerów (mockuj `ipcMain`, `dialog`, `BrowserWindow`).
- Testy przepływu walidacji (np. wybór folderu gry).

### Warstwa renderer (Vue)
- Komponenty z logiką: `@vue/test-utils` + Vitest.
- Pinia stores: testuj computed (`displayedMods`, `groupedMods`), akcje (`displayCategory`, `toggleCategoryExpanded`), mutacje stanu.
- Komponenty czysto prezentacyjne (truncate, tooltip): smoke test renderowania + sprawdzenie atrybutów (`title`, klas CSS).

### Migracje configu
- Każda migracja `AppConfiguration` (zmiana formatu pola) wymaga testu:
  - stary format → nowy format (idempotentność).
  - brak pola → wartość domyślna.
  - uszkodzony JSON → odpowiedni `ConfigurationError`.

### Cross-platform
- Funkcje rozgałęziające się po `process.platform` testuj z mockiem (`vi.stubGlobal` lub `Object.defineProperty(process, 'platform', ...)`) dla `win32` i `linux`.

## Konwencje
- Nazwa testu: `describe('<NazwaService>', () => { it('does X when Y', ...) })`.
- **Wszystkie opisy testów (`describe`, `it`) piszemy po angielsku** — bez wyjątków, niezależnie od języka reszty kodu / komentarzy.
- Każdy `expect` musi być znaczący — nie testuj implementacji, testuj zachowanie.
- Jedno założenie = jeden `it`.

## Definition of Done dla kroku planu
- [ ] Kod zaimplementowany.
- [ ] Testy napisane i przechodzą (`npm run test`).
- [ ] Brak nowych błędów typescript (`tsc --noEmit` w odpowiednim pakiecie).
- [ ] Brak nowych ostrzeżeń lintera dotyczących zmienionych plików.
- [ ] Wpis w `journal.md` z liczbą testów.

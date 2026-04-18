# Notatki agenta — Etap 3

## Założenia

- Etap 1 ukończony (relatywne ścieżki) — kluczowe dla cross-platform, bo separatory się różnią.

## Znaleziska

- `events.ts` używa `'gothic3.exe'` (lowercase), `configuration-service.ts` `'Gothic3.exe'` (camel) — niespójność do naprawy.
- `Static/G3_World_01.wrldatasc`, `Projects_compiled.m0x/n0x` — twarde nazwy plików, na Linuksie case-sensitive.
- `pak-service.ts` ma `shell: true` w `execFile` — to anti-pattern (security), warto przemyśleć przy okazji.

## Do późniejszych etapów

- Refaktor `pak-service.ts` na `spawn` bez shella.
- Audyt wszystkich `child_process` użyć pod kątem injection.

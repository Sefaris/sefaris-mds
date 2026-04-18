# Decyzje — Etap 1

## Do ustalenia na starcie
- Separator w przechowywanych ścieżkach (`/` zalecane dla cross-platform vs natywny `path.sep`).
- Zachowanie dla wpisów spoza `gothicPath` przy migracji: odrzucić cicho czy zalogować ostrzeżenie?
- Czy `filesCreated` ma być posortowany po migracji (deterministyczność diffów configu)?

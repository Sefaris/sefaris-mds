# Notatki agenta — Etap 2

## Założenia
- Etap 1 ukończony (filesCreated relatywne) — bez tego etap 2 nie ma sensu, bo `filesCreated` i tak by się rozjechało.

## Znaleziska
- `HomeView.vue::onMounted` to centralny punkt obsługi błędów configu.
- `events.ts::open-folder-dialog-game` waliduje wybór `gothic3.exe` w pętli — można reużyć.

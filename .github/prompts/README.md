# Prompty zmian użytkowników

Każdy plik `*.prompt.md` w tym katalogu to osobny etap zmian gotowy do uruchomienia w Copilot Chat (`/` → wybierz prompt).

## Kolejność wykonania

1. [01-relative-files-created](01-relative-files-created.prompt.md) — `filesCreated` jako ścieżki relatywne. **Fundament dla etapu 2.**
2. [02-game-path-change-keep-config](02-game-path-change-keep-config.prompt.md) — zachowanie configu przy zmianie folderu gry.
3. [03-linux-support](03-linux-support.prompt.md) — natywne wsparcie Linuksa (case-insensitive, ręczny folder sejwów).
4. [04-truncate-option-key](04-truncate-option-key.prompt.md) — szybki fix UI: skrócenie długich kluczy opcji.
5. [05-mod-list-display-mode](05-mod-list-display-mode.prompt.md) — drugi tryb listy modów (grupowanie po kategoriach).

## Zalecenia
- Etapy 1 i 2 trzymaj razem w jednym PR (logicznie powiązane).
- Etap 3 osobny PR — duży zakres, łatwiej review.
- Etap 4 może iść solo lub razem z 5 (oba czysto frontendowe).
- Po każdym etapie: `npm run test` + ręczny smoke test.

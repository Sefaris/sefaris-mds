# Decyzje — Etap 4

## Ustalone

- Zamiast sztywnego `max-w-[Xpx]` truncate jest **responsywny**: root `ConfigTooltip` jest flex-itemem (`min-w-0 flex-1 overflow-hidden`), a span z nazwą ma `block truncate`. Szerokość reguluje rodzic (np. okno opcji — może być powiększane bez sztywnych progrów).
- W `DisplayBaseOption` slot prawej strony opakowany w `<div class="shrink-0">`, a kontener ma `gap-4`, by składnik z wartością nigdy nie był ściśnięty.
- `ConfigTooltip` otrzymał prop `truncate: boolean` (default `true`) — można wyłączyć dla użyć nie-flex (`StarterOptionsView` działa domyślnie poprawnie, bo też jest w flex justify-between).
- Atrybut `title` ustawiany tylko gdy `truncate=true` — natywny tooltip pełnej nazwy.

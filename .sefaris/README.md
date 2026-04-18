# Sefaris MDS — przepływ realizacji etapów

Ten katalog (`.sefaris/`) trzyma **historię realizacji** zmian: plany, dzienniki, decyzje, notatki agenta i strategię testów per etap.

## Struktura

```
.sefaris/
├── README.md                    ← ten plik
├── _templates/                  ← szablony dla nowych etapów
│   ├── plan.md
│   ├── journal.md
│   ├── decisions.md
│   ├── agent-notes.md
│   ├── tests.md
│   └── progress.md
└── stages/
    ├── 01-relative-files-created/
    │   ├── plan.md
    │   ├── journal.md
    │   ├── decisions.md
    │   ├── agent-notes.md
    │   ├── tests.md
    │   └── progress.md
    ├── 02-game-path-change-keep-config/
    ├── 03-linux-support/
    ├── 04-truncate-option-key/
    └── 05-mod-list-display-mode/
```

## Powiązane

- `.github/prompts/NN-*.prompt.md` — opis WYMAGAŃ etapu (input dla agenta).
- `.github/agents/sefaris-stage.agent.md` — definicja custom agenta wykonującego etap.
- `.github/instructions/testing.instructions.md` — wymuszone wymagania testowe.
- `.github/instructions/project-conventions.instructions.md` — konwencje kodu.

## Jak uruchomić etap

1. W Copilot Chat wybierz custom agent **Sefaris Stage Executor** (z `.github/agents/` — dropdown agentów w polu chatu).
2. Napisz: `start etap NN` (np. `start etap 1`).
3. Agent wczyta prompt + pliki etapu i zaproponuje plan.
4. Po akceptacji planu agent realizuje krok po kroku, aktualizując `plan.md`, `journal.md`, testując i raportując.
5. Decyzje wymagające Twojej zgody — agent pyta i loguje w `decisions.md`.

## Zasady prowadzenia historii

- **Append-only** dla `journal.md` i `decisions.md`. Nigdy nie kasuj wpisów.
- `plan.md` można aktualizować (zmiana statusu kroków, dopisanie nowych).
- `agent-notes.md` może być reorganizowany — to scratchpad agenta.
- `progress.md` — zawsze aktualne podsumowanie (1 ekran).
- `tests.md` — checklista testów + uzasadnienie braków pokrycia.

## Tworzenie nowego etapu

```
mkdir .sefaris/stages/NN-nazwa
cp .sefaris/_templates/*.md .sefaris/stages/NN-nazwa/
```

(lub poproś agenta — zrobi to sam przy starcie etapu, jeśli folder nie istnieje).

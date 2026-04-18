# Decyzje — Etap 2

## 1. Modal z dwoma akcjami zamiast sekwencyjnego alert+dialog

- Data: 2026-04-18
- Kontekst: Trzeba dać użytkownikowi możliwość świadomego wyboru "wskaż nową ścieżkę" vs "anuluj".
- Opcje: a) Rozszerzyć istniejący `AlertModal.vue` o dodatkowy przycisk akcji (przez prop + emit). b) Stworzyć nowy `ConfirmModal.vue`. c) Sekwencyjnie: alert OK → dialog wyboru folderu.
- Wybór: (b) — nowy `ConfirmModal.vue`. Lekki, izolowany, nie zaśmieca semantyki `AlertModal` (który jest globalny przez postMessage). Modal używany lokalnie w `HomeView.vue`.
- Konsekwencje: jeden dodatkowy plik, brak refaktora globalnego mechanizmu alertów.

## 2. Backup configu retencja: 1 plik (`.bak`), zawsze nadpisywany

- Data: 2026-04-18
- Kontekst: Prompt wymaga backupu przed nadpisaniem świeżym configiem.
- Opcje: a) Pojedynczy `<config>.bak` nadpisywany przy każdym backupie. b) Historia (`<config>.bak.<timestamp>`).
- Wybór: (a). Backup ma znaczenie głównie awaryjne (recovery po corruption); wystarczy ostatni stan.
- Konsekwencje: minimalna złożoność. Backup nadpisuje poprzedni.

## 3. Backup tworzony przez `loadConfiguration` przy strukturalnym błędzie

- Data: 2026-04-18
- Kontekst: Skąd inicjować backup — preload service vs renderer?
- Opcje: a) `loadConfiguration` przy `INVALID_CONFIGURATION` automatycznie wykonuje backup. b) Renderer wywołuje osobną funkcję `backupConfiguration()` przed `saveConfiguration`.
- Wybór: (a). Self-contained — renderer nie musi pamiętać o backupie. Backup jest zawsze synchronizowany z momentem wykrycia uszkodzenia.
- Konsekwencje: `loadConfiguration` ma efekt uboczny zapisu pliku `.bak`. Udokumentowane w komentarzu funkcji.

## 4. Anulowanie wyboru ścieżki nie zamyka aplikacji

- Data: 2026-04-18
- Kontekst: Prompt: "user może ponowić".
- Wybór: po anulowaniu modal zostaje otwarty (brak akcji); user może kliknąć "Wybierz ponownie" lub zamknąć aplikację ręcznie. Stan `mods` nie jest ładowany dopóki ścieżka nie zostanie zaktualizowana.
- Konsekwencje: Brak `closeApplication()` po anulowaniu. UI w "stuck" stanie do akcji użytkownika — akceptowalne dla recovery flow.

## 5. Test komponentowy HomeView (krok 2.9) odłożony

- Data: 2026-04-18
- Kontekst: Plan przewidywał test komponentowy z `@vue/test-utils`. Brak go w `package.json`; setup wymagałby nowej zależności i konfiguracji jsdom.
- Opcje: a) Dodać `@vue/test-utils` + `jsdom` i napisać test. b) Odłożyć — pokrycie funkcji recovery w warstwie preload (14 testów) jest wystarczające do potwierdzenia kontraktu.
- Wybór: (b). Dodanie zależności wymaga osobnego wpisu (zgodnie z `project-conventions`) i wykracza poza zakres etapu skupiony na warstwie konfiguracji.
- Konsekwencje: Krok 2.9 pozostaje otwarty; flow renderer przetestowany manualnie (krok 2.10).

## 6. Renderer nie składa ścieżek stringami — `modsPath` przelicza preload

- Data: 2026-04-18
- Kontekst: W pierwotnej iteracji `HomeView.vue` ustawiał `raw.modsPath = `${gamePath}/${MODS_DIRECTORY}``, co łamie konwencję "używaj path.join, nigdy konkatenacji".
- Wybór: ustawiamy `raw.modsPath = ''` przed `saveConfiguration`; preload (`saveConfiguration`) sam przelicza `modsPath` przez `path.join(config.gothicPath, MODS_DIRECTORY)`.
- Konsekwencje: Mniej kodu w rendererze, separator zgodny z platformą, brak duplikacji logiki ścieżek.

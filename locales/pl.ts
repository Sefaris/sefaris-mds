export default {
  nav: {
    top: {
      support: 'Wesprzyj',
      options: 'Opcje',
      discord: 'Discord',
    },
    bottom: {
      title: 'Twoje towary',
      all: 'Wszystkie',
      installed: 'Zainstalowane',
      categories: 'Kategorie',
      presets: 'Presety',
    },
  },
  main: {
    mods: {
      notFound: 'Nie znaleziono modów',
      selectAll: 'Zaznacz wszystkie mody. (Ignoruje niekompatybilność)',
      deselectAll: 'Odznacz wszystkie mody.',
      openGameFolder: 'Otwórz folder z grą.',
      openModsFolder: 'Otwórz folder z modami.',
      openDocumentsFolder: 'Otwórz folder dokumentów.',
      openStarterFolder: 'Otwórz folder startera.',
    },
    preview: {
      default: 'Wybierz modyfikację aby dowiedzieć się więcej',
      author: 'Autor',
      authors: 'Autorzy',
      noDescription: 'Brak opisu dla tej modyfikacji.',
      openModFolder: 'Otwórz folder modyfikacji.',
      dependencies: 'Zależności: ',
      incompatibles: 'Niekompatybilne: ',
    },
  },
  action: {
    play: 'Graj',
    install: 'Zainstaluj',
    delete: 'Usuń',
    cancel: 'Anuluj zmiany',
  },
  alert: {
    installed: 'Modyfikacje pomyślnie zainstalowane w ',
    deleted: 'Modyfikacje zostały pomyślnie usunięte.',
    wrongPath: 'Gothic3.exe nie znaleziony. Wybierz właściwy folder.',
    presetNotFound: 'Nie znaleziono presetu: ',
    configNotFound: 'Plik konfiguracyjny nie znaleziony lub uszkodzony. Wskaż folder z grą.',
    foundAlreadyInstalledFiles: 'Znaleziono pliki modów. Instaluj mody na czystą instancję gry!',
    modFilesNotFound:
      'Zainstalowane mody nie znalezione. Usunąłeś mody ręcznie? Resetuje plik konfiguracyjny.',
    missingModsFromPreset: 'Nie znaleziono modyfikacji z presetu: ',
    checkLog: 'Coś poszło nie tak. Sprawdź app.log',
    dependencyNotFound: 'Nie znaleziono zależności:',
    presetSaved: 'Preset pomyślnie zapisany.',
    iniSaved: 'Konfiguracja pomyślnie zapisana.',
    resolveIncompatibility:
      'Zaznaczenie zależności zakończone niepowodzeniem z powodu niekompatybilności:',
    with: 'z',
  },
  progress: {
    saveConfiguration: 'Zapisywanie konfiguracji',
    copyMods: 'Kopiowanie modyfikacji',
    delete: 'Usuwanie modów',
    copyScripts: 'Kopiowanie skryptów',
    buildStringtable: 'Budowanie napisów',
    moveOldSaves: 'Przenoszenie zapisów',
    searchMods: 'Szukanie modów',
    mergeArchives: 'Łączenie archiwów',
    dontTurnOff: 'Nie wyłączaj programu!',
  },
  config: {
    inisNotFound: 'Nie znaleziono żadnych plików konfiguracyjnych.',
    gothicPath: 'Ścieżka Gothic',
    modsPath: 'Ścieżka modów',
    ignoreDependencies: 'Ignoruj zależności',
    ignoreIncompatibles: 'Ignoruj niekompatybilność',
    starter: 'Ustawienia startera',
    description: {
      gothicPath: 'Ścieżka do folderu z zainstalowanym Gothic 3.',
      modsPath: 'Ścieżka do folderu zawierającego mody.',
      ignoreDependencies: 'Wyłącza automatycznie zaznaczanie modów oznaczonych jako wymagane.',
      ignoreIncompatibles: 'Umożliwia instalację modów oznaczonych jako niekompatybilne.',
    },
    nav: {
      back: 'Wróć',
      save: 'Zapisz',
    },
    option: {
      on: 'Wł.',
      off: 'Wył.',
    },
  },
  tooltip: {
    default: 'Domyślne',
    dependencyOf: 'Zależne od',
    incompatibleWith: 'Zablokowane przez',
  },
  modal: {
    preset: 'Preset',
    save: 'Zapisz',
    close: 'Zamknij',
    presetName: 'Zapisz preset jako',
    error: 'Błąd',
    info: 'Informacja',
    warning: 'Ostrzeżenie',
    success: 'Sukces',
    openDocuments: 'Otwórz lokaliację logów',
  },
};

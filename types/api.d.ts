//legenda głosi, że to by mogło zadziałać, ale nie działa i ts nie zamyka mordy
interface Apieriusz {
  onFolderSelected(callback: (folderPath: string) => void): void;
}

interface Window {
  Apieriusz: Apieriusz;
}

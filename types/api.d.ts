interface Apieriusz {
  onFolderSelected(callback: (folderPath: string) => void): void;
}

interface Window {
  Apieriusz: Apieriusz;
}

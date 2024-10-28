export class InstallationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InstallationError';
  }
}

export const DEFAULT_LANGUAGE = 'pl';

export const LANGUAGE_SETTINGS = [
  { code: 'pl', text: 'Polski' },
  { code: 'ru', text: 'Русский' },
  { code: 'gb', text: 'English' },
] as const;

export type SUPPORTED_LANGUAGES = (typeof LANGUAGE_SETTINGS)[number]['code'];

export const DEFAULT_LANGUAGE = 'gb';

export const LANGUAGE_SETTINGS = [
  { code: 'pl', text: 'Polski' },
  { code: 'ru', text: 'Русский' },
  { code: 'gb', text: 'English' },
] as const;

export type SUPPORTED_LANGUAGES = (typeof LANGUAGE_SETTINGS)[number]['code'];

export const SEFARIS_WEBSITE = 'https://www.sefaris.eu/';
export const SEFARIS_KOFI = 'https://ko-fi.com/sefaris';

export const UTF8 = 'utf-8';

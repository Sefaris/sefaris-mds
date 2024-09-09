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

export const GOTHIC_KEYS = [
  'ESC',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  'MINUS',
  'EQUALS',
  'BACKSPACE',
  'TAB',
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'LEFT BRACKET',
  'RIGHT BRACKET',
  'RETURN',
  'LEFT CTRL',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'SEMICOLON',
  'APOSTROPHE',
  'GRAVE',
  'LEFT SHIFT',
  'BACKSLASH',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  'COMMA',
  'PERIOD',
  'MINUS2',
  'RIGHT SHIFT',
  'NUM MUL',
  'LEFT ALT',
  'SPACE',
  'CAPS LOCK',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'NUMLOCK',
  'SCROLL',
  'NUM 7',
  'NUM 8',
  'NUM 9',
  'NUM SUB',
  'NUM 4',
  'NUM 5',
  'NUM 6',
  'NUM 1',
  'NUM 2',
  'NUM 3',
  'NUM 0',
  'NUM DEL',
  'PIPE',
  'F11',
  'F12',
  'F13',
  'F14',
  'F15',
  'NUM ENTER',
  'RIGHT CTRL',
  'NUM DIV',
  'RIGHT ALT',
  'PAUSE',
  'HOME',
  'CURSOR UP',
  'PAGE UP',
  'CURSOR LEFT',
  'CURSOR RIGHT',
  'END',
  'CURSOR DOWN',
  'PAGE DOWN',
  'INSERT',
  'DELETE',
  'LEFT OS KEY',
  'RIGHT OS KEY',
];

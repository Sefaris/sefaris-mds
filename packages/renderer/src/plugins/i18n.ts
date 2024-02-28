import {createI18n} from 'vue-i18n';

import en from '../../../../locales/en';
import pl from '../../../../locales/pl';
import ru from '../../../../locales/ru';

//TODO: wyrzucić stałe do osobnego pliku
export const DEFAULT_LANGUAGE = 'pl';

export const LANGUAGE_SETTINGS = [
  {code: 'pl', text: 'Polski'},
  {code: 'ru', text: 'Русский'},
  {code: 'gb', text: 'English'},
] as const;

export type SUPPORTED_LANGUAGES = (typeof LANGUAGE_SETTINGS)[number]['code'];

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: DEFAULT_LANGUAGE,
  messages: {
    gb: en,
    pl,
    ru,
  },
});

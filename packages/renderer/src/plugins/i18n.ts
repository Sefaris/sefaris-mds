import { createI18n } from 'vue-i18n';
import { DEFAULT_LANGUAGE } from '../utils/constants';

import en from '../../../../locales/en';
import pl from '../../../../locales/pl';
import ru from '../../../../locales/ru';

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

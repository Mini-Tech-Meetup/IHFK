import { LOCALES } from '../data/locales.js';

export class I18n {
  constructor(session) { this.session = session; }
  t(key, vars = {}) {
    let value = LOCALES[this.session.locale]?.[key] ?? LOCALES.en[key] ?? key;
    for (const [name, replacement] of Object.entries(vars)) value = value.replaceAll(`{${name}}`, String(replacement));
    return value;
  }
  missingKeys() {
    const base = Object.keys(LOCALES.en);
    return Object.entries(LOCALES).flatMap(([locale, data]) => base.filter(key => !(key in data)).map(key => `${locale}:${key}`));
  }
}

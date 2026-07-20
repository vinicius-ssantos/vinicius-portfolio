import type en from "./messages/en.json";

// Typed message keys/autocomplete for useTranslations/getTranslations, per
// next-intl's TypeScript setup. `en` is the reference shape — pt.json's
// structural equivalence to it is enforced by src/lib/__tests__/messages.test.ts,
// not by this file (JSON imports don't get the "as Translation" compile-time
// check translations.ts used to provide).
type Messages = typeof en;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- next-intl's documented augmentation pattern requires an `interface`, not a `type` alias, here.
  interface IntlMessages extends Messages {}
}

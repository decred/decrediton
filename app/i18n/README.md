# Decrediton i18n & l12n

This file explains the general layout of how internationalization (i18n) and localization (l12n) work in Decrediton.

## During Coding

Default message of any string should be **in english**.

### Simple Strings

Don't hardcode strings or messages. On react components use the following syntax for writing a label, title or other fixed string:

```javascript
...
import { FormattedMessage } from "react-intl";

...

<FormattedMessage id="send.title" defaultMessage="Send Funds" /></div>
...

```

The id string is meant to uniquely identify the string being translated. Don't repeat the id of an existing string if the message is/could be different.

### Strings with Interpolation

If the string has a variable element within it (eg., a number, amount or a variable name) use the following syntax:

```javascript

<FormattedMessage
  id="history.paginationPages"
  defaultMessage="{current} of {total}"
  values={{
    current: currentPage+1,
    total: totalPages}} />
```


### DCR Amount

To display an amount of DCR, use the `Balance` component:

```javascript
import Balance from "../../Balance";
<Balance amount={fee}/>
```

## Libraries

Decrediton implements i18n by using the tools provided by the [react-intl](https://github.com/yahoo/react-intl) ecosystem.

## Filesystem Layout

The following directories and files comprise the i18n subsystem:

- **extracted/**: Generated automatically by [babel-plugin-react-intl](https://github.com/yahoo/babel-plugin-react-intl)
- **locales/index.js**: Entrypoint for all i18n data
- **pot/**: source *.pot files to be sent to translation
- **po/**: source *.po files received from translators
- **translations/\*.json**: Translated files to be used by the app

Inside the `translations/` directory, there are a few special files:

- **dev.json**: All strings of the app but not maintained on transifex (mainly useful while developing the i18n system and to check if all strings are translated).
- **whitelist_dev.json**: Created automatically by [react-intl-translations-manager](https://github.com/GertjanReynaert/react-intl-translations-manager)

The files inside the `po/` and `pot/` subdir are managed by the scripts and by transifex and shouldn't be manually updated.

## Generating files for translation

Assuming all strings in the app have been properly recorded on the `extracted/` dir by the babel plugin, to generate the `decrediton.pot` file to be sent for translation, run the following:

```shell
$ npm run i18n-prepare-untranslated
```

## Assembling translated files

Transifex will generate a bunch of *.po files (one per language). Save them on the `translations/` dir. To get back the json files that the app actually uses, execute the following:

```shell
$ npm run i18n-assemble-translated
```


## Adding a new locale

To add a new locale, get the translated file (.po) for it, place on the translated dir and assemble the translated .json.

Then modify the file `locales/index.js` by adding a new locale. Use one of the existing languages as template.

# The "dev" locale

The "dev" locale ("Dev Locale for testing" in the app) is used mainly for testing the i18n subsystem. It doesn't go through transifex for translation and is mainly used by developers (it should not be shown in production).

Any developer can change any string, format or property of this locale as needed for testing and without risking to modify a locale actually used in production.

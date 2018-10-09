# Decrediton i18n & l12n

This file explains the general layout of how internationalization (i18n) and localization (l12n) work in Decrediton.

## During Coding

Default message of any string should be **in english**.

### Simple Strings

Don't hardcode strings or messages. On react components use the following syntax for writing a label, title or other fixed string:

```javascript
...
import { FormattedMessage as T } from "react-intl";

...

<T id="send.title" m="Send Funds" />
...

```

The id string is meant to uniquely identify the string being translated. Don't repeat the id of an existing string if the message is/could be different.

### Strings with Interpolation

If the string has a variable element within it (eg., a number, amount or a variable name) use the following syntax:

```javascript
<T
  id="history.paginationPages"
  m="{current} of {total}"
  values={{
    current: currentPage+1,
    total: totalPages}} />
```

### Input Placeholder

A placeholder can't use a jsx component as value, only a simple string. So you need to use the react-intl API to get a translated string (see [OutputRow.js](../components/views/SendPage/OutputRow.js) or [AccountsSelect.js](../components/AccountsSelect.js) as examples.

The main steps to using a placeholder are:

- Import `injectIntl` and `defineMessages`
- Define a custom intl message (id and defaultMessage)
- Get the translated string using `int.formatMessage()`
- Inject the `intl` prop by using the `injectIntl` HOC

Simplified example:

```javascript
import { injectIntl, defineMessages } from "react-intl";

const messages = defineMessages({
  destinationAddrPlaceholder: {
    id: "send.destinationAddrPlaceholder",
    defaultMessage: "Destination Address"
  },
});

const SendOutputRow = ({
  ...
  intl,
  ...
) => (...

  <input
    value={destination}
    type="text"
    className="send-address-hash-to"
    placeholder={intl.formatMessage(messages.destinationAddrPlaceholder)}
    onChange={compose(getOnChangeOutputDestination(index), e => e.target.value)}
    onBlur={onAttemptConstructTransaction}
);

export default injectIntl(SendOutputRow);
```

### Tooltip

Tooltips now accept embedded HTML safely. Use the `T` component described below. See files [CopyToClipboard.js](../components/shared/CopyToClipboard.js) or [DaemonLoading/Form.js](../components/views/GetStartedPage/DaemonLoading/Form.js) as examples.

### Pluralized Strings

Use the plural format for values:

```javascript
<T id="confirmSeed.wordsRemaining"
  m="{remainingSeedWords, plural, one {one word remaining} other {# words remaining} }"
  values={{remainingSeedWords: remainingSeedWords}} />
```

### Strings with embedded HTML

This is currently tricky to do. In general, HTML should **not** be included in strings to be translated because of possible compromise vectors (imagine some escaping combination allowing a translator to insert a `<script>` tag).

Current way of embedding an styled substring in a translated message is passing the substring as a value (example in [CreateWallet.js](../components/CreateWalletForm/CreateWallet.js)):

```javascript
<T id="createWallet.lossInfo" m={`
  To help avoid permanent loss of your wallet, the seed must be backed up before continuing.

  {warningNotice} Failure to keep this seed private can result in the theft of your entire wallet. Under no circumstances should this seed ever be revealed to someone else.
  `}
  values={{
    warningNotice:
      <span className="orange-warning">
        <T id="createWallet.warningNotice" m="Warning"/>
      </span>
  }}
```

Notice the use of a `FormattedMessage` (actually, a JSX value) as the value to be passed to the `lossInfo` message.

### Date and Time

Use the `date` and `time` formats on the values inside the translation string. Custom formats may be available or written as needed on the [main locales file](locales/index.js).

```javascript
import { FormattedMessage as T } from "react-intl";
import { tsToDate } from "../../helpers/dateFormat";


<T id="transaction.timestamp"
  m="{timestamp, date, medium} {timestamp, time, medium}"
  values={{timestamp: tsToDate(txTimestamp)}}/>

```

**:exclamation: Note**: Due to how react-intl works, the date and time is only translated if the format string is translated (i.e. it can't rely on the `defaultMessage` string). So the translation must be filled, even if using the exact same date and time formats.

**:exclamation: Note**: Also note that due to this quirk, locales that use the original english strings but a different date/time format need to get the translated strings as well. To provide a localization using the english strings, create a new locale using the `original.json` message file, which is also automatically maintained by the scripts.

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

- **extracted/app**: Generated automatically by [babel-plugin-react-intl](https://github.com/yahoo/babel-plugin-react-intl)
- **extract/static**: Static translation files (manually written)
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

## Obtaining translated files

To download the translated files from Transifex you have two options: log in to the Transifex admin UI, go into each resource, click on the action menu (the three vertical dots menu at the top right corner of the UI) and select "Download All Translations". You'll get a zip file with all translated files in your email.

A second option is to use the [Transifex CLI client](https://docs.transifex.com/client/config). Again, log into Transifex, go to your settings page and create an API token. Then configure an environment variable `TX_TOKEN` holding the value of the generated token.

Then install the Transifex CLI client via pip (minimum version: **0.13.4**) and run `tx pull -a`. For example:

```
$ cd src/decrediton
$ export TX_TOKEN="<your api token>"
$ tx pull -a
```

**:exclamation: Note**: I (@matheusd) haven't personally tested the `tx push` command within the Decrediton project, so pushing might wrongly replace the resources in Transifex. Use with care!

## Assembling translated files

Transifex will generate a bunch of *.po files (one per language). Save them on the `po/` dir. To get back the json files that the app actually uses, execute the following:

```shell
$ npm run i18n-assemble-translated
```

**:exclamation: Note**: Transifex generates files with a filename following the pattern `decrediton_(lang).po` but react-intl-po expects a filename with the pattern `decrediton.(lang).po`. The `i18n-assemble-translated` script deletes old and renames the files in the po dir accordingly, so just extract the zip with all translations in the appropriate directory and the script will take care of the rest.


## Adding a new locale

To add a new locale, get the translated file (.po) for it, place on the translated dir and assemble the translated .json.

Then modify the file `locales/index.js` by adding a new locale. Use one of the existing languages as template.

# The "dev" locale

The "dev" locale ("Dev Locale for testing" in the app) is used mainly for testing the i18n subsystem. It doesn't go through transifex for translation and is mainly used by developers (it should not be shown in production).

Any developer can change any string, format or property of this locale as needed for testing and without risking to modify a locale actually used in production.

**:exclamation: Note**: If you test a packaged version of decrediton locally while still using the `dev` locale, you'll get an error on the debug console saying _language is not defined_. Just edit your local `config.json` and change locale to "en".

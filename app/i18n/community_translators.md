# Community Translators

Decrediton translations are handled by the various localized communities. Please note that translations are only accepted from **well-known** community members.

This document describes the process such community members may take to perform a Decrediton translation.

Two translation flows are documented here:

- **Basic**: Suitable for smaller communities, that don't have a technical member that can keep up to date with the building requirements of Decrediton.
- **Advanced**: Preferable when the community member is a software developer or can be relied to be self-sufficient in learning the tooling around building and running a development version of Decred software.

The main limitation of the basic UI translation flow is that it doesn't support testing the translation of the more extensive docs (such as tutorials, info modals, etc) and it depends upon the release of a Release Candidate (RC) version of Decrediton to be provided by the development team. This makes it more likely that the translation will end up missing some final strings included in changes made very close to the final released version and the translators might have to write the translations on a tight schedule.

The advanced translation flow requires setting up a local building infrastructure for Decrediton. This setup is more involved, recommended when the translator is a software developer (and thus already have experience doing these kinds of setups) or is a self-sufficient technical person and can figure most things by themselves. The main advantage is that this method allows doing translations at any time during development and to immediately test any necessary adjustments to the translation.

The next sections detail both translation flows.

## Basic UI Translation

Basic UI translation can be done once an RC (release candidate) version of Decrediton is released.

Translators have to fulfill the following requirements:

- Create a [GitHub](https://github.com) account
- Install [git software](https://guides.github.com/introduction/git-handbook/)
- Download the latest released Decrediton RC version
- Follow the [#translations](https://matrix.to/#/#translations:decred.org) matrix chat room for announcements regarding Decrediton translation work

Do note this document does not attempt to explain how git or GitHub works, so at least some basic knowledge about those is expected. See the links above for some starting points.

To generate a new translation file for inclusion in the next release, follow the following procedure.

### Check out the most recent Decrediton source:

To setup the repository for the first time, fork it in the GitHub interface, then clone it:

```shell
$ git clone git@github.com:<github-username>/decrediton
$ cd decrediton
$ git remote add upstream https://github.com/decred/decrediton
$ git fetch upstream
```

When updating an already existing install, fetch the latest changes. **Important**: this will **discard** any local changes. Those changes will be lost **forever**.

```shell
$ git fetch upstream
$ git reset --hard
```

### Create a new working branch

This updates the working copy and creates a new branch for the translation work. Replace `[new-decrediton-version]` with the new version under development.

```shell
$ git checkout -b translations-v[new-decrediton-version] upstream/master
```


### Use the Translation UI

Open the file `decrediton-install-dir/app/i18n/translator.html` in a browser. This can be done by opening a modern browser, typing `file:///` in the address bar, then navigating to the dir where Decrediton source code as checked out.

That file contains a very simple UI for working with Decrediton translation files.

Load the following files, all located in the checked out copy of the repository, in the `app/i18n/translations` subdir:

- `previous_original.json` (this file contains the original strings of the _previous_ Decrediton version)
- `original.json` (this file contains the original strings of the _current_ Decrediton version)
- `<lang>.json` (this file contains the latest translation for the given language).

Use the translation UI to fill any missing strings. The UI should be pretty self-explanatory.

### Test and Complete the Translation

During the translation process, the progress can be checked by saving the translation file somewhere and then loading it into Decrediton,
using the `View -> Load Custom Translation` menu item.

After translating all strings, replace the existing `<lang>.json` file in the Decrediton repository when all strings have been properly translated.

### Submit the Translation

The translation can be submitted for review using standard git operations:

```shell
$ git add app/i18n/translations/<lang>.json
$ git commit -m "Translations for <lang> v<new-decrediton-version>"
$ git push -u origin translations-v[new-decrediton-version]:translations-v[new-decrediton-version]
```

After successfully pushing to your clone of the Decrediton repo, [create a Pull Request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) based on it.

The changes will be reviewed and merged to the current working copy of Decrediton, so that they'll be present in the next version.

## Advanced UI Translation

The more extensive documentation (alerts, information boxes and modals, tutorials, etc) requires deeper knowledge about Decred to be accurately translated.

This is _usually_ best done by a software developer that is fluent in both english and the target language, that can additionally refer to the code and technical documents to understand the deeper concepts of the project and that can effectively communicate with the rest of the development team. However, note that being a dev is absolutely **not** a requirement. Just note we usually expect prospective members that want to do this to be significantly self-sufficient in setting up their own environments and doing their own research before asking for questions.

### Setup a Build Environment

To be able to accurately test the translation of documents, translators need to setup a build environment for Decrediton. This involves checking out and building `dcrd`, `dcrwallet`, `dcrlnd` and Decrediton itself.

See the [Development Setup](/README.md#development-setup) section of the README for a general instructions.

Remember to use the Testnet network for the test wallets. If at all possible, prefer using a separate computer or Virtual Machine for the test environment, to ensure any Mainnet wallets aren't run with code that is not yet production ready.

### Translate the Docs

The more extensive docs are located in the `app/i18n/docs` subdir. There should be a dir for each translated language.

Each `.md` file is a separate document. All translated files need to appear in the corresponding `index.md` file.

The `en` dir contains the default english version of the documents and should be used as a reference for the other languages.

### Test the Translation

Testing the docs with the build environment setup is easy: just start Decrediton in development mode (`yarn dev`) and access the specified page. You can find where in the app a given document was used by searching for its variable name (for example `SeedCopyWarning`).

### Submit the Translation

This follows the same process as the basic translation flow and is a standard GitHub PR flow. Commit and push the translation to a branch in your forked copy of the repo, and then open a PR so that it can be included in the release.

Translators are **strongly** recommended to join the Decrediton dev channel in Matrix, so that they are up to speed in any last minute changes to the release and can be contacted in a timely fashion.

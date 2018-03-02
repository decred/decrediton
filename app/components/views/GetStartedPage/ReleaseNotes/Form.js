import { LogsTab } from "views/HelpPage/LogsTab";
import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { LoaderBarBottom } from "indicators";
import { InvisibleButton } from "buttons";

export default ({
  onHideReleaseNotes,
  onShowSettings,
  onShowLogs,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft
}) => (
  <div className="page-body getstarted">
    <div className="getstarted loader logs">
      <div className="content-title">
        <div className="loader-settings-logs">
          <InvisibleButton onClick={onShowSettings}>
            <T id="getStarted.btnSettings" m="Settings" />
          </InvisibleButton>
          <InvisibleButton onClick={onShowLogs}>
            <T id="getStarted.btnLogs" m="Logs" />
          </InvisibleButton>
        </div>
        <Tooltip text={ <T id="logs.goBack" m="Go back" /> }><div className="go-back-screen-button" onClick={onHideReleaseNotes}/></Tooltip>
        <T id="getStarted.logsTitle" m="Decrediton v1.1.2 Released" />
      </div>
      <div className="release-notes">
        <div className="release-notes-text">
          <p>
            This release marks a major turning point in our overall look and feel of
            Decrediton. We have introduced consistent header areas with a new subpage/tab
            interface. React-motion has been added to give a better feel for transitions
            from page to page and expanded area reveals. All information modals and
            passphrase modals have been consolidated to have a consistent feel whenever they
            are used.
          </p>
          <p>
            As part of the design overhaul, the Tickets page has begun its transformation
            to provide a much better user experience. My Tickets subpage is the first step
            into giving users a clearer picture into their current staking situation. In
            the upcoming release, we will be adding extensive statistics and graphing to
            further help visualize a given users' balance and staking history. Overall,
            we aim to continue to add more tools that will help users' staking experience
            be much more enjoyable and carefree.
          </p>
          <p>
            We have also added advanced daemon setup abilities for users that want to use
            remote daemons or use a different location for their blockchain data. In the
            next release, we plan on also adding the ability to handle advanced back-end
            wallet setups: easily switch between different wallet files on the same machine,
            connecting to a remote wallet and other possible situations. But these advanced
            options will also be completely transparent for users that choose to run with
            the default settings.
          </p>
          <p>
            We have added a Security Center page that will be a catch-all place to
            store tools that we feel have utility, but aren't needed for everyday normal
            wallet operation. The first 2 tools that have been added are for Signing and
            Verifying messages using addresses and private keys to prove ownership of a
            given address. Here is a typical use case: User A wants to prove to User B
            that they control a given address. With the Sign Message tool, User A enters
            the address, a message and their wallet's private passphrase. The tool produces
            a hash that was created based on that address' private key and the given
            message. With the Verify Message tool, User B can use the address in question,
            the hash and the message from User A to verify that it was signed using that
            address' private key.
          </p>
          <p>
            We are also happy to announce the introduction of internationalization.
            Brazilian Portuguese has been added for the first pass and we will be slowly
            adding more languages on every new release.
          </p>
            Things to expect in the next release:
            <ul>
              <li>New overview page design</li>
              <li>Rich historical Statistics/Graphs</li>
              <li>New staking account user experience</li>
              <li>Advanced wallet settings</li>
              <li>More languages translated</li>
            </ul>
            Bug fixes
            <ul>
              <li>Fix issue on Windows caused by using "Aux" as a filename. Aux is a restricted
                filename with Windows and a simple filename change fixed it.</li>

              <li>Fix shutdown issue with macOS. When cmd-Q or quitting Decrediton from the
              dock caused dcrd and dcrwallet to not be shutdown in the background. By
              adding a final closeClis() in app.on("before-quit",...) it ensures that
              everything is closed on any shutdown.</li>

              <li>Removed Skip Sync button due to the new slip44 change in dcrwallet. With the
              new coin type change, dcrwallet needs to check if there has been any address
              usage up to that point in the chain for a given wallet.</li>

              <li>Shorten account names in various areas to avoid obnoxious overflow.</li>

              <li>Fix issue that was occuring when clearing out stakepool configurations. This
              would cause users to possibly have incorrect stakepool setups.</li>

              <li>Change functionality of the space key during seed entry. Previously, when the
              user would enter the space key they would end up not "selecting" a word and
              then just type the whole seed. Now the space "selects" the word just as
              pressing tab does.</li>
            </ul>
        </div>
        <div className="release-notes-image" />
      </div>
      <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft }}  />
    </div>
  </div>
);

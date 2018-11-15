import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { LoaderBarBottom } from "indicators";
import { InvisibleButton } from "buttons";
import { LogsLinkMsg, SettingsLinkMsg } from "../messages";

export default ({
  onHideReleaseNotes,
  onShowSettings,
  onShowLogs,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  appVersion,
  getWalletReady,
  getDaemonStarted,
  isDaemonRemote,
}) => (
  <div className="page-body getstarted">
    <div className="getstarted loader logs">
      <div className="content-title">
        <div className="loader-settings-logs">
          <Aux>
            {getWalletReady &&
              <InvisibleButton onClick={onShowSettings}>
                <SettingsLinkMsg />
              </InvisibleButton>
            }
            {(getDaemonStarted && !isDaemonRemote) || getWalletReady ?
              <InvisibleButton onClick={onShowLogs}>
                <LogsLinkMsg />
              </InvisibleButton> :
              <div/>
            }
          </Aux>
        </div>
        <div className="go-back-screen-button-area">
          <Tooltip text={ <T id="releaseNotes.goBack" m="Go back" /> }><div className="go-back-screen-button" onClick={onHideReleaseNotes}/></Tooltip>
        </div>
        <T id="getStarted.releaseNotesTitle" m="Decrediton v{version} Released" values={{ version: (appVersion) }}/>
      </div>
      <div className="release-notes">
        <div className="release-notes-text">
          <p>
            This release of Decrediton marks the dawn of a large milestone in development.
            SPV (simple payment verification) has been added in dcrwallet which allows
            wallets to connect directly to peers and not required a fully synced node to be
            connected.  For now this feature will be turned OFF by default, then when we
            have gotten thorough feedback and a confident in the usage, it will be turned
            on by default.
          </p>
          <p>
            While it's hard to give details of speed increases due to variances in systems,
            we've seen roughly a 5x increase in syncing a previously used seed to tip on
            mainnet.  Previously, syncing the chain would take roughly 1hr plus another 5-10
            mins for the wallet to become synced. Now, we're seeing about 20mins total time
            to being able to fully use a wallet to send or purchase tickets.
          </p>
          <p>
            In the coming releases, we are going to work on further speeding this process up,
            as well as providing more feedback from dcrwallet to Decrediton to make a richer
            user experience.
          </p>
          <p>
            *Note: Automatic ticket purchasing has been disabled for SPV.  We will be
            implementing a way to start and stop the new v2 ticketbuyer in dcrwallet.  This
            new version is much simpler and really only has 1 option to set which would
            be an absolute balance to maintain.  This new version will also allow users to
            run multiple ticket purchases for each account.
          </p>
          <p>
            This release also has been audited by our design team at Eeter, LLC.  Most of the
            pages have received an update to the styling to add more polish and be more
            resilient to various sizing and displays.  In the near future, we will be
            focusing on color themes and window sizing for small, medium and large displays.
          </p>
          <p>
            We are also proud to announce the initial release of the Politeia integration.
            While this functionality is still in beta-testing, what you see will be roughly
            the final form.  Proposals up for vote will be shown and your possible tickets
            will be compared to the proposal's allowed tickets to vote.  If there are
            tickets available to vote, you simply make your choice, enter your passphrase
            and your tickets are used to send the Politeia server your cryptographic proof
            of ownership.
          </p>
          New Features
          <ul>
            <li>SPV integration - *Note: This integration is currently hidden from normal
            usage, if you would like to test it, please set `"spv_mode": true`, in your
            `config.json` file.  With this new integration, there has been a new way of
            syncing that has been added.  Now instead of needing to do all of the wallet
            loader processes in the proper order, one can simply call the SpvSync grpc and
            that will handle everything within dcrwallet.  This will lead to much less
            errors and other headaches down the road.  We have also added an
            `"spv_connect": [],` option in the `config.json` file, which will allow users to
            connect directly to a known peer instead of relying on the DNS seeders to find
            peers.</li>
            <li>Whitelisting and Proxy - We have added new support to control the connections
            to domains that are used for various information.  We have also added proxy
            support for those that choose to have the extra security.  These were both
            necessary since the addition of Politeia wallet's communicating with the outside
            world.  We felt the users should have full control over where the wallet is
            communicating.  This support will be further improved upon in future releases
            and requests for things are made.</li>
            <li>Initial Politeia Integration - *Note: This integration is currently hidden
            from normal usage, but can be accessed by setting `"politeia_beta": true`, in
            your `config.json` file.  When activated the user is shown a new page on the
            side bar menu, reading "Governance."  This will show them the Politeia
            information, of which is pulled from a request to the proposals site.
            They will be shown currently live and past votes.</li>
            <li>Animated Onboarding Slides - All new animated slides were added.  Big thanks
            for all the hard work from @kyleFirethought and everyone at Eeter! They really
            make the wallet shine.</li>
          </ul>
          Other improvements
          <ul>
            <li>Launcher - The launcher UI was audited and has most of its issues smoothed
            out.  There were some lingering issues and possible ways of users to get "stuck"
            while loading up their wallets.</li>
            <li>Inputs and Errors - All inputs have been audited for consistency and proper
            input error states are now being used.  We are very pleased with the look and
            feel of the input errors and believe they are not too intrusive for users while
            being very clear of what needs to be corrected.</li>
            <li>Max Wallet Option - Users are now able to set the max wallets that are
            shown on the launcher screen.  The default is currentlyset to 3.  But keep in mind
            that it was styled assuming only 3 would be shown, so there may be some distortions
            as that number grows.  </li>
            <li>Refined About Modal - The additional window was removed in favor of a React
            modal.  This allowed us to clean up the code and remove a redundant menu bar
            group.</li>

            <li>Long Form Translations - Due issues translating large pieces of text that were
            split up into partial sentences, we are now keeping large sections of
            documentation that need to be translated together.  This is for things like the
            onboarding slides and various informational modals.</li>
          </ul>
        </div>
        <div className="release-notes-image" />
      </div>
      <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft }}  />
    </div>
  </div>
);

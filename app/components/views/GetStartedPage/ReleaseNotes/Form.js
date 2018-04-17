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
  getEstimatedTimeLeft,
  appVersion
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
        <T id="getStarted.logsTitle" m="Decrediton v{version} Released" values={{ version: (appVersion) }}/>
      </div>
      <div className="release-notes">
        <div className="release-notes-text">
          <p>
          This release of decrediton adds some major changes to the wallet startup,
          overview page and adds the first round of statistics for better user
          information.  Now that the overall look and feel designed by Eeter has been
          impletmented we will be focusing on refinement and adding improved
          responsiveness (eg dark mode, resolving to various media widths).
          </p>
          <p>
          Launcher has been redesigned to provide the user with a more intuitive startup
          experience.  In normal working mode, the daemon (of the chosen network) will
          begin to sync and become operational while the user completes wallet
          creation/selection.  Then once both the wallet is ready and the daemon has
          synced the wallet will fully load.
          </p>
          <p>
          A tutorial, release notes, settings and logs have all been added to the
          launcher for the user to utilize whilst they may be waiting for their daemon
          to sync.  Hopefully this will allow the user to more seamlessly create wallets
          with less confusion or require any additional support.
          </p>
          <p>
          The wallet creation by seed has received a substantial update as well.  We now
          allow the user to copy seeds (if they complete a warning screen) and also paste
          seeds.  And for confirmation for new wallets only requires the user to complete
          1/3 of the words to confirm storage of wallet's seed.
          </p>
          <p>
          Overview has beed redesigned to give the user more information about their
          wallet's current situation and to guide them where to find various features
          of their wallet.  Basic graphs covering balances, tickets and transactions have
          been added.  All recent transactions and recent ticket activity can be found
          below the overview graphs.  We will be adding more features to the overview page
          as we gauge user interest and feedback on existing additions.
          </p>
          <p>
          Introductory data prepartion and statistics have been implemented for this
          release.  For now we are providing a small window of lookback for transactions,
          staking and other information.  The reduced window size is mostly an issue
          with unsatisfactory performance.  When this performance improves, we will be
          adding custom windows and window lengths for custom graphing and exporting
          options.
          </p>
          New Features
          <ul>
            <li>Validate Addresses - a form to validate addresses has been added to the
            Security Center.  This will allow users to test addresses to confirm address
            ownership and/or validity.</li>

            <li>Filter by address - now transactions can be filtered by address in History.
            When the user enters a string into the address filter form, it will show any
            address that has an output with a matching address.</li>

            <li>Charts - we have decided to use [recharts](https://recharts.org) as our first
            charting solution.  </li>

            <li>Import wallet from hex seed - instead of entering in the 33 word
            mnemonic, they are now able to use the hex representation of their seed.</li>

            <li>Export data to CSV - we now all users to export various types of data to csv.
            These options are found under the Transactions page.  </li>

            <li>Show logs - logs can now be found on the launcher and on the help page.
            For now, we only show the logs of the current instance of wallet and daemon.
            This is mostly due to performance with pulling in thousands of lines of text.</li>
          </ul>
        </div>
        <div className="release-notes-image" />
      </div>
      <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft }}  />
    </div>
  </div>
);

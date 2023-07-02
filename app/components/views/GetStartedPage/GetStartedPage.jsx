import { injectIntl } from "react-intl";
import { useGetStarted } from "./hooks";
import { InvisibleButton } from "buttons";
import {
  LogsLinkMsg,
  SettingsLinkMsg,
  UpdateAvailableLink,
  LearnBasicsMsg,
  ReleaseInfoMsg
} from "./messages";
import { PageBody } from "layout";
import { LoaderBarBottom } from "indicators";
import { classNames } from "pi-ui";
import styles from "./GetStarted.module.css";

const GetStarted = ({
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft
}) => {
  const {
    onShowLogs,
    onShowSettings,
    updateAvailable,
    isTestNet,
    PageComponent,
    showNavLinks,
    onShowTutorial,
    onShowReleaseNotes
  } = useGetStarted();

  return (
    <PageBody
      data-testid="getstarted-pagebody"
      getStarted
      isTestNet={isTestNet}>
      <div className={classNames(styles.container)}>
        <div className={styles.topLinks}>
          {updateAvailable && (
            <UpdateAvailableLink
              updateAvailable={updateAvailable}
              className={styles.updateAvailableLink}
              tooltipClassName={styles.updateAvailableTooltip}
            />
          )}
          {showNavLinks && (
            <>
              <InvisibleButton
                onClick={onShowTutorial}
                className={classNames(
                  styles.invisibleButton,
                  styles.tutorialButton
                )}>
                <LearnBasicsMsg />
              </InvisibleButton>
              <InvisibleButton
                onClick={onShowReleaseNotes}
                className={classNames(
                  styles.invisibleButton,
                  styles.releaseNotesButton
                )}>
                <ReleaseInfoMsg />
              </InvisibleButton>
              <InvisibleButton
                onClick={onShowSettings}
                className={styles.invisibleButton}>
                <SettingsLinkMsg />
              </InvisibleButton>
              <InvisibleButton
                onClick={onShowLogs}
                className={styles.invisibleButton}>
                <LogsLinkMsg />
              </InvisibleButton>
            </>
          )}
        </div>
        {PageComponent &&
          (React.isValidElement(PageComponent) ? (
            PageComponent
          ) : (
            <PageComponent />
          ))}
        <LoaderBarBottom
          {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft }}
        />
      </div>
    </PageBody>
  );
};

export default injectIntl(GetStarted);

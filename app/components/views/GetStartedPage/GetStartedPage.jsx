import { injectIntl } from "react-intl";
import { useGetStarted } from "./hooks";
import { InvisibleButton } from "buttons";
import {
  LogsLinkMsg,
  SettingsLinkMsg,
  UpdateAvailableLink,
  AboutModalButton
} from "./messages";
import { PageBody } from "layout";
import { LoaderBarBottom } from "indicators";
import { classNames } from "pi-ui";
import styles from "./GetStarted.module.css";

const GetStarted = ({
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  appVersion
}) => {
  const {
    onShowLogs,
    onShowSettings,
    updateAvailable,
    isTestNet,
    PageComponent,
    showNavLinks
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
          <AboutModalButton {...{ appVersion, updateAvailable }} />
          {showNavLinks && (
            <>
              <InvisibleButton onClick={onShowSettings}>
                <SettingsLinkMsg />
              </InvisibleButton>
              <InvisibleButton onClick={onShowLogs}>
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

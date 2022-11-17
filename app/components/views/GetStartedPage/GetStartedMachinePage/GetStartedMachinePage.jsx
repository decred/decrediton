import { classNames } from "pi-ui";
import { AnimatedLinearProgressFull } from "indicators";
import styles from "./GetStartedMachinePage.module.css";

export default ({
  StateComponent,
  error,
  availableWalletsError,
  text,
  animationType,
  daemonWarning,
  loaderBarContainer,
  hideTextBlock,
  showLoaderBar,
  onCancelLoadingWallet,
  onContinueOpeningWallet,
  onSaveAndContinueOpeningWallet,
  nextStateAfterWalletLoading,
  ...props
}) => {
  const loaderBar = (
    <AnimatedLinearProgressFull
      {...{
        setInterval,
        min: 0,
        error,
        text,
        animationType,
        initialAnimationType: styles.initial,
        hideTextBlock,
        onCancelLoadingWallet,
        onContinueOpeningWallet,
        onSaveAndContinueOpeningWallet,
        nextStateAfterWalletLoading
      }}
    />
  );

  return (
    <>
      {showLoaderBar &&
        (loaderBarContainer ? (
          React.createElement(loaderBarContainer, { loaderBar }, null)
        ) : (
          <div className={styles.loaderBar}>{loaderBar}</div>
        ))}
      {error && (
        <div className={classNames(styles.error, styles.launchError)}>
          {error}
        </div>
      )}
      {availableWalletsError && (
        <div className={classNames(styles.error, styles.launchError)}>
          {availableWalletsError}
        </div>
      )}
      {daemonWarning && (
        <div className={classNames(styles.daemonWarning)}>{daemonWarning}</div>
      )}
      {StateComponent &&
        (React.isValidElement(StateComponent) ? (
          StateComponent
        ) : (
          <StateComponent {...{ ...props }} />
        ))}
    </>
  );
};

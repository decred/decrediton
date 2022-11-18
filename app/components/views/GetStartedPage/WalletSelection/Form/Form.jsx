import { FormattedMessage as T } from "react-intl";
import { useIntl } from "react-intl";
import {
  classNames,
  Tooltip,
  Icon,
  useTheme,
  getThemeProperty,
  ButtonIcon
} from "pi-ui";
import { RemoveWalletButton } from "buttons";
import { FormattedRelative, Subtitle } from "shared";
import { FormContainer, ContentContainer /* , Row */ } from "../../helpers";
import styles from "./Form.module.css";
import {
  TutorialOverview,
  tutorials
} from "../../../SettingsPage/TutorialsTab/helpers";
import {
  LoaderTitleMsg,
  LoaderTitleMsgChooseTheWalletToAccess,
  messages
} from "../../messages";

const WalletSelectionForm = ({
  availableWallets,
  showCreateWalletForm,
  showCreateTrezorBackedWalletForm,
  onRemoveWallet,
  onToggleEditWallet,
  editWallets,
  submitChosenWallet,
  onShowOnboardingTutorial
}) => {
  const { theme } = useTheme();
  const intl = useIntl();
  const trezorIconColor = getThemeProperty(theme, "light-blue");
  const accentBlue = getThemeProperty(theme, "accent-blue");
  const green = getThemeProperty(theme, "green-2");
  const lightGreen = getThemeProperty(theme, "light-green");
  const closeButtonColor = getThemeProperty(theme, "background-back-color");

  const CreateButton = (props) => (
    <ButtonIcon
      type="create"
      onClick={() => showCreateWalletForm(true)}
      text={intl.formatMessage(messages.newSeedTabMsg)}
      iconColor={accentBlue}
      {...props}
    />
  );

  const RestoreButton = (props) => (
    <ButtonIcon
      type="restore"
      onClick={() => showCreateWalletForm(false)}
      text={intl.formatMessage(messages.restoreTabMsg)}
      iconColor={green}
      iconBackgroundColor={lightGreen}
      {...props}
    />
  );

  const TrezorButton = (props) => (
    <ButtonIcon
      type="trezor"
      onClick={() => showCreateTrezorBackedWalletForm()}
      text={intl.formatMessage(messages.trezorTabMsg)}
      iconColor={trezorIconColor}
      {...props}
    />
  );

  return (
    <div className={styles.container}>
      <ContentContainer>
        <div>
          <LoaderTitleMsg />,
        </div>
        <div>
          <LoaderTitleMsgChooseTheWalletToAccess />
        </div>
      </ContentContainer>

      <FormContainer>
        <div className={styles.displayWalletContainer}>
          {availableWallets.length > 0 ? (
            <>
              <div className={classNames(styles.buttons, "flex-row")}>
                {editWallets ? (
                  <ButtonIcon
                    type="cancel"
                    className={styles.close}
                    onClick={onToggleEditWallet}
                    iconColor={closeButtonColor}
                    text={intl.formatMessage(messages.closeEditWallets)}
                  />
                ) : (
                  <>
                    <CreateButton />
                    <RestoreButton />
                    <TrezorButton />
                    <ButtonIcon
                      type="edit"
                      onClick={onToggleEditWallet}
                      text={intl.formatMessage(messages.editWallets)}
                    />
                  </>
                )}
              </div>
              {availableWallets.map((wallet) => {
                return (
                  <div
                    className={styles.displayWallet}
                    key={wallet.label}
                    onClick={
                      !editWallets
                        ? () => submitChosenWallet({ selectedWallet: wallet })
                        : null
                    }>
                    <div
                      style={
                        wallet.displayWalletGradient && {
                          background: wallet.displayWalletGradient
                        }
                      }
                      className={styles.gradient}
                    />
                    <Icon
                      type="wallet"
                      size={38}
                      className={styles.walletIcon}
                    />
                    <div className={styles.displayWalletName}>
                      {wallet.value.wallet}
                    </div>
                    <div
                      className={classNames(
                        "flex-row",
                        "justify-end",
                        styles.walletTypeIcons
                      )}>
                      {editWallets ? (
                        <div>
                          <Tooltip
                            content={
                              <T
                                id="walletselection.removeWalletButton"
                                m="Remove Wallet"
                              />
                            }>
                            <RemoveWalletButton
                              className={classNames(
                                styles.displayWalletButton,
                                styles.remove
                              )}
                              modalTitle={
                                <T
                                  id="walletselection.removeConfirmModal.title"
                                  m="Remove {wallet}"
                                  values={{
                                    wallet: (
                                      <span className="mono">
                                        {wallet.value.wallet}
                                      </span>
                                    )
                                  }}
                                />
                              }
                              modalContent={
                                <T
                                  id="walletselection.removeConfirmModal.content"
                                  m="Warning this action is permanent! Please make sure you have backed up your wallet's seed before proceeding."
                                />
                              }
                              onSubmit={() => onRemoveWallet(wallet)}
                            />
                          </Tooltip>
                        </div>
                      ) : (
                        <>
                          {wallet.value.isPrivacy && (
                            <div>
                              <Tooltip
                                content={
                                  <T id="walletselection.privacy" m="Privacy" />
                                }>
                                <Icon type="privacy" size={21} />
                              </Tooltip>
                            </div>
                          )}
                          {wallet.value.isLN && (
                            <div>
                              <Tooltip
                                content={
                                  <T id="walletselection.ln" m="Lightning" />
                                }>
                                <Icon type="ln" size={21} />
                              </Tooltip>
                            </div>
                          )}
                          {wallet.value.isTrezor && (
                            <div>
                              <Tooltip
                                content={
                                  <T id="walletselection.trezor" m="Trezor" />
                                }>
                                <Icon
                                  type="trezor"
                                  size={21}
                                  iconColor={trezorIconColor}
                                />
                              </Tooltip>
                            </div>
                          )}
                          {wallet.isWatchingOnly && (
                            <div>
                              <Tooltip
                                content={
                                  <T
                                    id="walletselection.watchOnly"
                                    m="Watch Only"
                                  />
                                }>
                                <Icon type="watchOnly" size={21} />
                              </Tooltip>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className={styles.displayWalletLastAccess}>
                      {!wallet.finished ? (
                        <T
                          id="walletselection.setupIncomplete"
                          m="Setup incomplete"
                        />
                      ) : (
                        wallet.lastAccess && (
                          <>
                            <T
                              id="walletselection.lastAccess"
                              m="Last accessed"
                            />
                            :{" "}
                            <FormattedRelative
                              value={wallet.lastAccess}
                              updateInterval={1 * 1000}
                            />
                          </>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <CreateButton className={styles.largeButtonIcon} />
              <RestoreButton className={styles.largeButtonIcon} />
              <TrezorButton className={styles.largeButtonIcon} />
            </>
          )}
        </div>
      </FormContainer>

      <Subtitle
        className={styles.subtitle}
        title={
          <T
            id="getstarted.tutorials.learnAboutDecred"
            m="Learn about decred"
          />
        }
      />
      {["decredIntro", "powPos", "lifecycle", "blocks"].map((name) => (
        <TutorialOverview
          {...{
            key: name,
            name,
            tutorials,
            viewTutorialHandler: onShowOnboardingTutorial,
            showProgressBar: false
          }}
        />
      ))}
    </div>
  );
};

export default WalletSelectionForm;

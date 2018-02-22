import CreateWalletForm from "./CreateWalletForm";
import ExistingOrNewScreen from "./ExistingOrNewScreen";
import "style/GetStarted.less";
/*
const OpenWalletCreateFormHeader = ({
  startupError,
  isInputRequest,
  confirmNewSeed,
  onReturnToNewSeed,
  onToggleNewExisting
}) => (
  <Header
    headerTop={startupError
      ? <div key="walletCreateError" className="get-started-view-notification-error">{startupError}</div>
      : null}
    headerMetaOverview={(
      <div className="get-started-create-wallet-header">
        <div className="get-started-subheader">
          <T id="getStarted.header.createWallet.meta" m="Create a wallet" /></div>
        {isInputRequest ? (
          <div className="get-started-button-toolbar">
            {confirmNewSeed ? (
              <SlateGrayButton
                className="get-started-view-button-go-back"
                onClick={onReturnToNewSeed}
              ><T id="getStarted.backBtn" m="Back" /> </SlateGrayButton>
            ) : (
              <TextToggle
                activeButton={"left"}
                leftText={<T id="getStarted.newSeedTab" m="New Seed" />}
                rightText={<T id="getStarted.existingSeedTab" m="Existing Seed" />}
                toggleAction={onToggleNewExisting}
              />
            )}
          </div>
        ) : null}
      </div>
    )}
  />
);
*/
const OpenWalletCreateForm = ({
  existingOrNew,
  onReturnToNewSeed,
  onReturnToExistingOrNewScreen,
  onSetCreateWalletFromExisting
}) => (
  existingOrNew ?
    <ExistingOrNewScreen {...{ onSetCreateWalletFromExisting }} /> :
    <CreateWalletForm {...{ onReturnToNewSeed, onReturnToExistingOrNewScreen } }/>
);

export default OpenWalletCreateForm;

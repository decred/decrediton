import { RegisterPageContent, RegisterPageHeader } from "./RegisterPage";
import { DexViewContent, DexViewHeader } from "./DexView";
import { useDex } from "./hooks";
import { StandalonePage, StandaloneHeader } from "layout";
import {
  CreateWalletPageContent,
  CreateWalletPageHeader
} from "./CreateWalletPage";
import { EnablePageContent, EnablePageHeader } from "./EnablePage";
import { InitPageContent, InitPageHeader } from "./InitPage";
import { LoginPageContent, LoginPageHeader } from "./LoginPage";
import {
  CreateDexAccountPageContent,
  CreateDexAccountPageHeader
} from "./CreateDexAccountPage";
import { DEX_ICON } from "constants";
import { FormattedMessage as T } from "react-intl";

const DexPage = () => {
  let Page, Header;
  const {
    dexActive,
    dexInit,
    loggedIn,
    dexRegistered,
    dexDCRWalletRunning,
    dexEnabled,
    dexBTCWalletRunning,
    dexAccount
  } = useDex();
  if (!dexEnabled) {
    Page = <EnablePageContent />;
    Header = <EnablePageHeader />;
  } else if (dexActive) {
    if (dexInit) {
      if (!loggedIn) {
        Page = <LoginPageContent />;
        Header = <LoginPageHeader />;
      } else if (dexRegistered && dexDCRWalletRunning && dexBTCWalletRunning) {
        Page = <DexViewContent />;
        Header = <DexViewHeader />;
      } else if (dexDCRWalletRunning && dexBTCWalletRunning) {
        Page = <RegisterPageContent />;
        Header = <RegisterPageHeader />;
      } else if (!dexAccount) {
        Page = <CreateDexAccountPageContent />;
        Header = <CreateDexAccountPageHeader />;
      } else if (!dexDCRWalletRunning || !dexBTCWalletRunning) {
        Page = <CreateWalletPageContent />;
        Header = <CreateWalletPageHeader />;
      }
    } else {
      Page = <InitPageContent />;
      Header = <InitPageHeader />;
    }
  } else {
    Page = <div><T id="dex.error.page" m="Critical Error! DEX is not running.  Please restart and check logs if problem persists." /></div>;
    Header = <ErrorHeader />;
  }
  return <StandalonePage header={Header}>{Page}</StandalonePage>;
};

const ErrorHeader = () => (
  <StandaloneHeader
    title={<T id="dex.error.title" m="DEX Error" />}
    description={<T id="dex.error.description" m={"Dex not running"} />}
    iconType={DEX_ICON}
  />
);

export default DexPage;

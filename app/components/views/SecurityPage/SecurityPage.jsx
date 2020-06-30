import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import { StandalonePage, StandaloneHeader } from "layout";
import SignMessage from "./SignMessage/SignMessage";
import { default as ValidateAddressTab } from "./ValidateAddress/ValidateAddress";
import { default as VerifyMessageTab } from "./VerifyMessage";

const SecurityHeader = () => (
  <StandaloneHeader
    iconClassName="security"
    title={<T id="security.title" m="Security Center" />}
    description={
      <T
        id="security.description"
        m="Various tools that help in different aspects of crypto currency security will be located here."
      />
    }
  />
);

export default () => {
  const [sideActive, setSideActive] = useState(true);

  return (
    <StandalonePage header={<SecurityHeader />}>
      <>
        <div className="advanced-page-toggle security-page">
          <div className="text-toggle">
            <div
              className={
                "text-toggle-button-left " +
                (sideActive && "text-toggle-button-active")
              }
              onClick={!sideActive ? () => setSideActive(true) : null}>
              <T id="security.signTitle" m="Sign Message" />
            </div>
            <div
              className={
                "text-toggle-button-right " +
                (!sideActive && "text-toggle-button-active")
              }
              onClick={sideActive ? () => setSideActive(false) : null}>
              <T id="security.verifyTitle" m="Verify Message" />
            </div>
          </div>
        </div>
        <div className="security-page-form">
          {sideActive ? <SignMessage /> : <VerifyMessageTab />}
        </div>
      </>
      <ValidateAddressTab />
    </StandalonePage>
  );
};
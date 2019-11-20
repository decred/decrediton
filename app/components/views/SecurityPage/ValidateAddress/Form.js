import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { Subtitle } from "shared";
import cx from "classnames";

const messages = defineMessages({
  addressFieldPlaceholder: {
    id: "securitycenter.validate.field.address.placeholder",
    defaultMessage: "Enter an address to validate"
  }
});

const InvalidAddress = () => (
  <div className={"validate-address-form-address-response invalid"}>
    <T id="securitycenter.validate.result.invalid" m="Invalid address" />
  </div>
);

const OwnedAddress = () => (
  <div className="validate-address-form-address-response owned valid">
    <T id="securitycenter.validate.result.owned" m="Owned address" />
  </div>
);

const NotOwnedAddress = () => (
  <div className="validate-address-form-address-response not-owned valid">
    <T id="securitycenter.validate.result.notOwned" m="Address Valid, Not Owned" />
  </div>
);

const Result = ({ validateAddressSuccess, error }) => {
  if (error || !validateAddressSuccess || !validateAddressSuccess.isValid) return <InvalidAddress />;
  if (!validateAddressSuccess.isMine) return <NotOwnedAddress />;
  return <OwnedAddress/>;
};

const OwnedData = ({ validateAddressSuccess }) => (
  <div className="validate-address-owned-form">
    <div className="validate-address-owned-data">
      <T id="securitycenter.validate.owned.accountNumber" m="Account Number"/>
      <div>{validateAddressSuccess.accountNumber}</div>
      <T id="securitycenter.validate.owned.branch" m="Branch"/>
      <div>{validateAddressSuccess.isInternal ? 1 : 0}</div>
      <T id="securitycenter.validate.owned.index" m="Index"/>
      <div>{validateAddressSuccess.index}</div>
    </div>
  </div>
);

const ValidateAddressForm = ({
  onAddressChange,
  validateAddressSuccess,
  error,
  address,
  intl
}) => (
  <>
    <Subtitle title={<T id="security.validate.title" m="Validate Addresses"/>} />
    <div className="validate-address-form">
      <div className="validate-address-form-label">
        <T id="securitycenter.validate.field.address.label" m="Address"/>
      </div>
      <div className={cx("validate-address-form-address", address && validateAddressSuccess && "valid-address")}>
        <TextInput
          value={address}
          placeholder={intl.formatMessage(messages.addressFieldPlaceholder)}
          onChange={(e) => onAddressChange(e.target.value)}
        />
      </div>
      { address && <Result validateAddressSuccess={validateAddressSuccess} error={error} /> }
    </div>
    { validateAddressSuccess && validateAddressSuccess.isMine &&
      <OwnedData validateAddressSuccess={validateAddressSuccess} /> }
  </>
);

export default injectIntl(ValidateAddressForm);

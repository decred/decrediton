import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { Subtitle } from "shared";
import { TextInput } from "inputs";
import { classNames } from "pi-ui";
import styles from "./ValidateAddressForm.module.css";

const messages = defineMessages({
  addressFieldPlaceholder: {
    id: "securitycenter.validate.field.address.placeholder",
    defaultMessage: "Enter an address to validate"
  }
});

const InvalidAddress = () => (
  <div
    className={classNames(
      styles.validateAddressFormResponse,
      styles.responseInvalid
    )}>
    <T id="securitycenter.validate.result.invalid" m="Invalid address" />
  </div>
);

const OwnedAddress = () => (
  <div
    className={classNames(
      styles.validateAddressFormResponse,
      styles.responseOwned
    )}>
    <T id="securitycenter.validate.result.owned" m="Owned address" />
  </div>
);

const NotOwnedAddress = () => (
  <div
    className={classNames(
      styles.validateAddressFormResponse,
      styles.responseNotOwned
    )}>
    <T
      id="securitycenter.validate.result.notOwned"
      m="Address Valid, Not Owned"
    />
  </div>
);

const Result = ({ validateAddressSuccess, error }) => {
  if (error || !validateAddressSuccess || !validateAddressSuccess.isValid)
    return <InvalidAddress />;
  if (!validateAddressSuccess.isMine) return <NotOwnedAddress />;
  return <OwnedAddress />;
};

const OwnedData = ({ validateAddressSuccess }) => (
  <div className={styles.validateAddressOwnedForm}>
    <div className={styles.validateAddressOwnedData}>
      <T id="securitycenter.validate.owned.accountNumber" m="Account Number" />
      <div>{validateAddressSuccess.accountNumber}</div>
      <T id="securitycenter.validate.owned.branch" m="Branch" />
      <div>{validateAddressSuccess.isInternal ? 1 : 0}</div>
      <T id="securitycenter.validate.owned.index" m="Index" />
      <div>{validateAddressSuccess.index}</div>
    </div>
  </div>
);

const ValidateAddressForm = ({
  address,
  error,
  intl,
  validateAddressSuccess,
  onChangeAddress
}) => (
  <>
    <Subtitle title={<T id="security.validate.title" m="Validate Address" />} />
    <div className={styles.validateAddressForm}>
      <div className={styles.validateAddressFormLabel}>
        <T id="securitycenter.validate.field.address.label" m="Address" />
      </div>
      <div
        className={classNames(
          styles.validateAddressFormInput,
          address && validateAddressSuccess && styles.validAddress
        )}>
        <TextInput
          id="validateAddressInput"
          value={address}
          placeholder={intl.formatMessage(messages.addressFieldPlaceholder)}
          onChange={(e) => onChangeAddress(e.target.value)}
        />
      </div>
      {address && (
        <Result validateAddressSuccess={validateAddressSuccess} error={error} />
      )}
    </div>
    {validateAddressSuccess &&
      validateAddressSuccess.isMine &&
      address !== "" && (
        <OwnedData validateAddressSuccess={validateAddressSuccess} />
      )}
  </>
);

export default injectIntl(ValidateAddressForm);

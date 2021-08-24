import { useSendTab } from "./hooks";
import { FormattedMessage as T, defineMessages } from "react-intl";
import { KeyBlueButton, EyeFilterMenu } from "buttons";
import { TextInput } from "inputs";
import styles from "./SendTab.module.css";
import { Subtitle } from "shared";
import { DescriptionHeader } from "layout";
import ReactTimeout from "react-timeout";
import DecodedPayRequest from "./DecodedPayRequest";
import BalancesHeader from "../BalancesHeader";
import { Button, classNames, Tooltip } from "pi-ui";
import { wallet } from "wallet-preload-shim";
import PaymentRow from "./PaymentRow";
import { LNPaymentModal } from "modals";
import { getSortTypes, getPaymentTypes } from "./helpers";

const messages = defineMessages({
  payReqInputLabel: {
    id: "ln.paymentsTab.payReq",
    defaultMessage: "Lightning Payment Request Code"
  },
  payReqInputPlaceholder: {
    id: "ln.paymentsTab.payReqPlaceholder",
    defaultMessage: "Request Code from an invoice"
  },
  payReqDecodeSuccessMsg: {
    id: "ln.paymentsTab.payReqDecodeSuccessMsg",
    defaultMessage: "Valid Lightning Request"
  },
  filterByHashPlaceholder: {
    id: "ln.paymentsTab.filterByHashPlaceholder",
    defaultMessage: "Filter by Payment Hash"
  },
  expiredErrorMsg: {
    id: "ln.paymentsTab.expiredErrorMsg",
    defaultMessage: "Invoice expired"
  }
});

export const SendTabHeader = () => (
  <DescriptionHeader
    description={
      <>
        <T
          id="ln.description.send"
          m="Paste the Payment Request Code to Send funds over Lightning Network."
        />
        <BalancesHeader />
      </>
    }
  />
);

const subtitleMenu = ({
  sortTypes,
  paymentTypes,
  listDirection,
  selectedPaymentType,
  searchText,
  intl,
  onChangeSelectedType,
  onChangeSortType,
  onChangeSearchText
}) => (
  <div className={styles.filterContainer}>
    <div className={styles.paymentSearch}>
      <TextInput
        newBiggerFontStyle
        className={styles.searchInput}
        id="filterByHashInput"
        type="text"
        placeholder={intl.formatMessage(messages.filterByHashPlaceholder)}
        value={searchText}
        onChange={(e) => onChangeSearchText(e.target.value)}
      />
    </div>
    <Tooltip
      contentClassName={styles.sortByTooltip}
      content={<T id="ln.paymentsTab.sortby.tooltip" m="Sort By" />}>
      <EyeFilterMenu
        labelKey="label"
        keyField="value"
        Transaction
        options={sortTypes}
        selected={listDirection}
        onChange={onChangeSortType}
        type="sortBy"
      />
    </Tooltip>
    <Tooltip
      contentClassName={styles.typeTooltip}
      content={<T id="ln.paymentsTab.paymentTypes.tooltip" m="Payment Type" />}>
      <EyeFilterMenu
        options={paymentTypes}
        selected={selectedPaymentType}
        onChange={onChangeSelectedType}
      />
    </Tooltip>
  </div>
);

const SendTab = ({ setTimeout }) => {
  const {
    payments,
    tsDate,
    payRequest,
    decodedPayRequest,
    decodingError,
    expired,
    sendValue,
    onPayRequestChanged,
    onSendPayment,
    onSendValueChanged,
    selectedPayment,
    setSelectedPayment,
    intl,
    searchText,
    listDirection,
    selectedPaymentType,
    onChangeSelectedType,
    onChangeSortType,
    onChangeSearchText
  } = useSendTab(setTimeout);

  return (
    <div className={styles.container}>
      <Subtitle title={<T id="ln.paymentsTab.send" m="Send" />} />
      <div className={styles.lnSendPayment}>
        <TextInput
          newBiggerFontStyle
          hideIcons
          className={styles.payReqInput}
          id="paymentRequestId"
          label={intl.formatMessage(messages.payReqInputLabel)}
          placeholder={intl.formatMessage(messages.payReqInputPlaceholder)}
          value={payRequest}
          inputClassNames={classNames(
            styles.addressInput,
            (decodingError || expired) && styles.error,
            !!decodedPayRequest && styles.success
          )}
          onChange={(e) => onPayRequestChanged(e.target.value)}
          successMessage={intl.formatMessage(messages.payReqDecodeSuccessMsg)}
          showSuccess={!!decodedPayRequest && !expired}
          showErrors={!!decodingError || expired}
          invalid={!!decodingError || expired}
          invalidMessage={
            decodingError
              ? decodingError
              : expired
              ? intl.formatMessage(messages.expiredErrorMsg)
              : null
          }>
          {!payRequest ? (
            <Button
              kind="secondary"
              size="sm"
              className={styles.pasteButton}
              onClick={(e) => {
                e.preventDefault();
                onPayRequestChanged(wallet.readFromClipboard());
              }}>
              Paste
            </Button>
          ) : (
            <Button
              aria-label="Clear Address"
              kind="secondary"
              className={classNames(
                styles.clearAddressButton,
                !!decodedPayRequest && !expired && styles.success
              )}
              onClick={(e) => {
                e.preventDefault();
                onPayRequestChanged("");
              }}>
              <div />
            </Button>
          )}
        </TextInput>
        {!!decodedPayRequest && (
          <>
            <DecodedPayRequest
              decoded={decodedPayRequest}
              tsDate={tsDate}
              expired={expired}
              sendValue={sendValue}
              onSendValueChanged={onSendValueChanged}
            />
          </>
        )}
      </div>
      {!!decodedPayRequest && !expired && (
        <div className={styles.buttonContainer}>
          <KeyBlueButton onClick={onSendPayment}>
            <T id="ln.paymentsTab.sendBtn" m="Send" />
          </KeyBlueButton>
        </div>
      )}
      <Subtitle
        className={styles.paymentHistorySubtitle}
        title={
          <T id="ln.paymentsTab.lightingPayments" m="Lightning Payments" />
        }
        children={subtitleMenu({
          sortTypes: getSortTypes(),
          paymentTypes: getPaymentTypes(),
          listDirection,
          selectedPaymentType,
          searchText,
          intl,
          onChangeSelectedType,
          onChangeSortType,
          onChangeSearchText
        })}
      />
      {payments && payments.length > 0 ? (
        <div>
          {payments.map((payment) => (
            <PaymentRow
              key={`row-${payment.paymentHash}`}
              payment={payment}
              tsDate={tsDate}
              onClick={() => setSelectedPayment(payment)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <T id="ln.paymentsTab.emptyPaymentList" m="No payment found" />
        </div>
      )}
      {selectedPayment && (
        <LNPaymentModal
          show={!!selectedPayment}
          onCancelModal={() => setSelectedPayment(null)}
          payment={selectedPayment}
          tsDate={tsDate}
        />
      )}
    </div>
  );
};

export default ReactTimeout(SendTab);

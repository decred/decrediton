import { FormattedMessage as T, defineMessages } from "react-intl";
import { Subtitle } from "shared";
import { DescriptionHeader } from "layout";
import { TextInput, DcrInput } from "inputs";
import styles from "./ReceiveTab.module.css";
import InvoiceRow from "./InvoiceRow";
import BalancesHeader from "../BalancesHeader";
import { useReceiveTab } from "./hooks";
import { PiUiButton, EyeFilterMenu } from "buttons";
import { LNInvoiceModal } from "modals";
import { getSortTypes, getInvoiceTypes } from "./helpers";
import { Tooltip } from "pi-ui";

const messages = defineMessages({
  requestedAmountLabel: {
    id: "ln.receiveTab.requestedAmountLabel",
    defaultMessage: "Requested Amount"
  },
  requestedAmountPlaceholder: {
    id: "ln.receiveTab.requestedAmountPlaceholder",
    defaultMessage: "0.00000000"
  },
  descriptionLabel: {
    id: "ln.receiveTab.descriptionLabel",
    defaultMessage: "Description"
  },
  descriptionPlaceholder: {
    id: "ln.receiveTab.descriptionPlaceholder",
    defaultMessage: "Message for Recepient"
  },
  filterByHashPlaceholder: {
    id: "ln.receiveTab.filterByHashPlaceholder",
    defaultMessage: "Filter by Payment Hash"
  }
});

export const ReceiveTabHeader = () => (
  <DescriptionHeader
    description={
      <>
        <T
          id="ln.description.receive"
          m="Generate a Lightning Invoice to receive DCR funds over the Lightning Network."
        />
        <BalancesHeader />
      </>
    }
  />
);

const subtitleMenu = ({
  sortTypes,
  invoiceTypes,
  listDirection,
  selectedInvoiceType,
  searchText,
  intl,
  onChangeSelectedType,
  onChangeSortType,
  onChangeSearchText
}) => (
  <div className={styles.filterContainer}>
    <div className={styles.invoiceSearch}>
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
      content={<T id="ln.receiveTab.sortby.tooltip" m="Sort By" />}>
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
      content={<T id="ln.receiveTab.invoiceTypes.tooltip" m="Invoice Type" />}>
      <EyeFilterMenu
        options={invoiceTypes}
        selected={selectedInvoiceType}
        onChange={onChangeSelectedType}
      />
    </Tooltip>
  </div>
);

const ReceiveTab = () => {
  const {
    invoices,
    tsDate,
    value,
    memo,
    addInvoiceAttempt,
    cancelInvoiceAttempt,
    onValueChanged,
    onMemoChanged,
    onAddInvoice,
    onCancelInvoice,
    intl,
    amountError,
    isFormValid,
    selectedInvoice,
    setSelectedInvoice,
    searchText,
    listDirection,
    selectedInvoiceType,
    onChangeSelectedType,
    onChangeSortType,
    onChangeSearchText
  } = useReceiveTab();

  return (
    <div className={styles.container}>
      <Subtitle title={<T id="ln.receiveTab.receiveHeader" m="Receive" />} />
      <div className={styles.lnAddInvoice}>
        <div className={styles.invoiceForm}>
          <DcrInput
            newBiggerFontStyle
            id="valueInput"
            amount={value}
            className={styles.amountInput}
            onChangeAmount={onValueChanged}
            label={intl.formatMessage(messages.requestedAmountLabel)}
            placeholder={intl.formatMessage(
              messages.requestedAmountPlaceholder
            )}
            showErrors={amountError && amountError}
            invalid={amountError && amountError}
            invalidMessage={amountError && amountError}
          />
          <TextInput
            newBiggerFontStyle
            id="descInput"
            value={memo}
            onChange={onMemoChanged}
            className={styles.descInput}
            label={intl.formatMessage(messages.descriptionLabel)}
            placeholder={intl.formatMessage(messages.descriptionPlaceholder)}
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <PiUiButton
          onClick={onAddInvoice}
          disabled={addInvoiceAttempt || !isFormValid}>
          <T id="ln.receiveTab.createInvoice" m="Create Invoice" />
        </PiUiButton>
      </div>
      <Subtitle
        className={styles.invoiceHistorySubtitle}
        title={<T id="ln.receiveTab.lightingInvoices" m="Lightning Invoices" />}
        children={subtitleMenu({
          sortTypes: getSortTypes(),
          invoiceTypes: getInvoiceTypes(),
          listDirection,
          selectedInvoiceType,
          searchText,
          intl,
          onChangeSelectedType,
          onChangeSortType,
          onChangeSearchText
        })}
      />
      {invoices && invoices.length > 0 ? (
        <div>
          {invoices.map((invoice) => (
            <InvoiceRow
              key={invoice.addIndex}
              invoice={invoice}
              tsDate={tsDate}
              onClick={() => setSelectedInvoice(invoice)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <T id="ln.receiveTab.emptyInvoiceList" m="No invoices found" />
        </div>
      )}
      {selectedInvoice && (
        <LNInvoiceModal
          show={!!selectedInvoice}
          onCancelModal={() => setSelectedInvoice(null)}
          onCancelInvoice={() => onCancelInvoice(selectedInvoice)}
          cancelInvoiceAttempt={cancelInvoiceAttempt}
          invoice={selectedInvoice}
          tsDate={tsDate}
        />
      )}
    </div>
  );
};

export default ReceiveTab;

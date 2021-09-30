import { FormattedMessage as T, defineMessages } from "react-intl";
import Modal from "../Modal";
import styles from "./ListUTXOsModal.module.css";
import { Table } from "pi-ui";
import { useListUtxo } from "./hooks";
import { Balance, CopyToClipboard } from "shared";
import { AccountsSelect } from "inputs";

const messages = defineMessages({
  utxo: {
    id: "listutxo.header.utxo",
    defaultMessage: "UTXO"
  },
  value: {
    id: "listutxo.header.value",
    defaultMessage: "Value"
  }
});

const ListUTXOsModal = ({ onCancelModal, show }) => {
  const { intl, unspentOutputs, account, setAccount } = useListUtxo();

  const data =
    unspentOutputs?.map((utxo) => {
      const utxoValue = `${utxo.txHash}:${utxo.outpointIndex}`;
      return {
        UTXO: (
          <div className={styles.utxoValue}>
            <span>{utxoValue}</span>
            <CopyToClipboard
              textToCopy={utxoValue}
              className={styles.copyIcon}
            />
          </div>
        ),
        Value: (
          <Balance
            amount={utxo.amount}
            classNameUnit={styles.balanceNameUnit}
            classNameSecondary={styles.balanceSecondary}
          />
        )
      };
    }) ?? [];

  const headers = [
    intl.formatMessage(messages.utxo),
    intl.formatMessage(messages.value)
  ];

  return (
    <Modal className={styles.modal} {...{ show, onCancelModal }}>
      <div className={styles.modalHeader}>
        <div className={styles.title}>
          <T id="listutxos.listUnspentUTXOs" m="List Unspent UTXOs" />
        </div>
        <AccountsSelect
          {...{ account, onChange: setAccount }}
          className={styles.accountSelect}
        />
      </div>
      <div className={styles.closeButton} onClick={onCancelModal} />

      <Table
        disablePagination
        data={data}
        headers={headers}
        headClassName={styles.tableHeader}
        bodyClassName={styles.tableBody}
        wrapperClassName={styles.tableWrapper}
        linesPerPage={Math.max(data.length, 1)}
      />
    </Modal>
  );
};

export default ListUTXOsModal;

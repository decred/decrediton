import { FormattedMessage as T } from "react-intl";
import Modal from "../Modal";
import styles from "./ListUTXOsModal.module.css";
import { Table } from "pi-ui";
import { useListUtxo } from "./hooks";
import { Balance } from "shared";
import { AccountsSelect } from "inputs";

const ListUTXOsModal = ({ onCancelModal, show }) => {
  const {
    unspentOutputs,
    account,
    setAccount
  } = useListUtxo();

  const data =
    unspentOutputs?.map((utxo) => {
      return {
        UTXO: `${utxo.txHash}:${utxo.outpointIndex}`,
        Value: (
          <Balance
            amount={utxo.amount}
            classNameUnit={styles.balanceNameUnit}
            classNameSecondary={styles.balanceSecondary}
          />
        )
      };
    }) ?? [];
  const headers = ["UTXO", "Value"];

  return (
    <Modal className={styles.modal} {...{ show, onCancelModal }}>
      <div className={styles.modalHeader}>
        <div className={styles.title}>
          <T id="listutxos.listUnspentUTXOs" m="List Unspent UTXOs" />
        </div>
        <AccountsSelect {...{ account, onChange: setAccount }} className={styles.accountSelect}/>
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

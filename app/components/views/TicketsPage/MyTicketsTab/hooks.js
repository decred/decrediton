import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ClientActions";
import * as ta from "actions/TransactionActions";
import { UNMINED, IMMATURE, LIVE } from "constants";
import { isEqual } from "lodash";
import QRCode from "qrcode";

export const useTicketsList = () => {
  const dispatch = useDispatch();

  // selectors
  const tickets = useSelector(sel.filteredStakeTxs);
  const tsDate = useSelector(sel.tsDate);
  const noMoreTickets = useSelector(sel.noMoreStakeTxs);
  const ticketsFilter = useSelector(sel.ticketsFilter);
  const window = useSelector(sel.mainWindow);

  // actions
  const goBackHistory = () => dispatch(ca.goBackHistory());
  const getTickets = (isStake) => dispatch(ta.getTransactions(isStake));
  const changeTicketsFilter = (newFilter) =>
    dispatch(ta.changeTicketsFilter(newFilter));

  const [QRs, setQRs] = useState([]);
  const [qrHashes, setQRHashes] = useState([]);
  const [QRsPage, setQRsPage] = useState(0);
  const [loadingQRs, setLoadingQRs] = useState(true);

  // Number of transaction hashes per QR.
  const TX_PER_QR = 10;

  const activeFilter = ({ status }) =>
    status === UNMINED || status === IMMATURE || status === LIVE;

  const onQRPageClick = ({ selected }) => {
    setQRsPage(selected);
  };

  // prepareQR asychronously updates the qr codes if current viewed ticket hashes
  // have changed since last viewing.
  const prepareQRs = useCallback(() => {
    setLoadingQRs(true);
    const filteredTiks = tickets.filter(activeFilter);
    const filteredHashes = filteredTiks.map(({ txHash }) => txHash);

    if (filteredHashes.length == 0) {
      setLoadingQRs(false);
      return;
    }

    // If QRs already generated for all given tickets, then nothing to do.
    if (isEqual(qrHashes, filteredHashes)) {
      setLoadingQRs(false);
      return;
    }

    const qrsPromises = [];
    // Create for each page of hashes a QR.
    for (let i = 0; i < Math.ceil(filteredHashes.length / TX_PER_QR); i++) {
      const start = i * TX_PER_QR;
      const qrdata = JSON.stringify(
        filteredHashes.slice(start, start + TX_PER_QR)
      );
      qrsPromises.push(QRCode.toDataURL(qrdata));
    }
    Promise.all(qrsPromises)
      .then((qrs) => {
        setQRHashes(filteredHashes);
        setQRs(qrs);
        setLoadingQRs(false);
      })
      // XXX snackbar error instead plzx.
      .catch((err) => console.log(err));
  }, [tickets, qrHashes]);

  return {
    tickets,
    tsDate,
    noMoreTickets,
    ticketsFilter,
    window,
    goBackHistory,
    getTickets,
    changeTicketsFilter,
    QRsPage,
    onQRPageClick,
    loadingQRs,
    QRs,
    prepareQRs
  };
};

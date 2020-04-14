import Modal from "./Modal";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as amc from "actions/AccountMixerActions";
import * as sel from "selectors";
import { useEffect } from "react";

function AddMixerAccountsModal({ show, onCancelModal, modalTitle }) {
  const dispatch = useDispatch();
  const [ mixedAccountName, setMixedAccountName ] = useState("");
  const [ changeAccountName, setChangeAccountName ] = useState("");
  const accounts = useSelector(sel.sortedAccounts);

  const isValid = () => !(!mixedAccountName || !changeAccountName);
  const onSubmit = (passphrase) =>
    dispatch(amc.createNeededAccounts(passphrase, mixedAccountName, changeAccountName));

  useEffect(() => {
    setMixedAccountName("");
    setChangeAccountName("");
  }, [show])

  return <Modal {...{
    mixedAccountName, changeAccountName, setMixedAccountName, onSubmit,
    setChangeAccountName, isValid, show, onCancelModal, modalTitle
  }} />;
}

export default AddMixerAccountsModal;

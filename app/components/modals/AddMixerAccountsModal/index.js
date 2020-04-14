import Modal from "./Modal";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as amc from "actions/AccountMixerActions";
import * as sel from "selectors";

function AddMixerAccountsModal({
  show, onCancelModal
}) {
  const dispatch = useDispatch();
  const [ mixedAccountName, setMixedAccountName ] = useState("");
  const [ changeAccountName, setChangeAccountName ] = useState("");
  const accounts = useSelector(sel.sortedAccounts);

  const isValid = () => !(!mixedAccountName || !changeAccountName || !passphrase);
  const onSubmit = (passphrase) =>
    dispatch(amc.createNeededAccounts(passphrase, mixedAccountName, changeAccountName));

  return <Modal {...{
    mixedAccountName, changeAccountName, setMixedAccountName, onSubmit,
    setChangeAccountName, isValid, show, onCancelModal
  }} />;
}

export default AddMixerAccountsModal;

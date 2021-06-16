import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import Modal from "../Modal";

const ConfirmationDialogModal = ({ ...props }) => {
  const show = useSelector(sel.confirmationDialogModalVisible);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ca.listenForConfirmationDialogRequests());
  }, [dispatch]);

  return (
    <Modal show={show} { ...props } >
    </Modal>
  );
};

export default ConfirmationDialogModal;

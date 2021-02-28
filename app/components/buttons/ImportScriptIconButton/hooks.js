import { useDispatch, useSelector } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";

export function useImportScriptIconButton() {
  const rescanRequest = useSelector(sel.rescanRequest);
  const isImportingScript = useSelector(sel.isImportingScript);

  const dispatch = useDispatch();
  const onImportScript = (script) => {
    dispatch(ca.manualImportScriptAttempt(script));
  };

  return {
    rescanRequest,
    isImportingScript,
    onImportScript
  };
}

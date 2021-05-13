import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as gov from "actions/GovernanceActions";

export function useBlockchain() {
  const allAgendas = useSelector(sel.allAgendas);
  const voteChoices = useSelector(sel.voteChoices);
  const dispatch = useDispatch();
  const viewAgendaDetailsHandler = (agendaId) => {
    return dispatch(gov.viewAgendaDetails(agendaId));
  };

  return {
    allAgendas,
    viewAgendaDetailsHandler,
    voteChoices
  };
}

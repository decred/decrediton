import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as gov from "actions/GovernanceActions";
import * as vspa from "actions/VSPActions";
import { useMountEffect } from "hooks";

export function useBlockchain() {
  const allAgendas = useSelector(sel.allAgendas);
  const voteChoices = useSelector(sel.voteChoices);
  const unspentUnexpiredVspTickets = useSelector(
    sel.unspentUnexpiredVspTickets
  );
  const availableVSPs = useSelector(sel.getAvailableVSPs);
  const outdatedUsedVsps = useMemo(
    () =>
      unspentUnexpiredVspTickets?.filter(
        (v) =>
          v.tickets.length > 0 &&
          availableVSPs?.find((av) => `https://${av.host}` === v.host)?.outdated
      ),
    [unspentUnexpiredVspTickets, availableVSPs]
  );

  const dispatch = useDispatch();
  const viewAgendaDetailsHandler = (agendaId) => {
    return dispatch(gov.viewAgendaDetails(agendaId));
  };

  useMountEffect(() => {
    dispatch(vspa.getUnspentUnexpiredVspTickets());
  });

  return {
    allAgendas,
    viewAgendaDetailsHandler,
    voteChoices,
    outdatedUsedVsps
  };
}

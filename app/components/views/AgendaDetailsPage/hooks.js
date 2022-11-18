import { useCallback, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as cli from "actions/ClientActions";
import { useParams } from "react-router-dom";
import { find, compose, eq, get } from "fp";

export const useAgendaDetails = () => {
  const getAgendaSelectedChoice = (agenda, voteChoices) =>
    get(
      ["choiceId"],
      find(compose(eq(agenda.name), get(["agendaId"])), voteChoices)
    ) || "abstain";
  const { name } = useParams();
  const allAgendas = useSelector(sel.allAgendas);
  const agenda = allAgendas.find((agenda) => agenda.name === name);
  const voteChoices = useSelector(sel.voteChoices);

  const agendaChoices = agenda.choices;
  const choices = useMemo(
    () =>
      agendaChoices.map((choice) => ({
        choiceId: choice.id
      })),
    [agendaChoices]
  );
  const selectedChoice = getAgendaSelectedChoice(agenda, voteChoices);

  const [newSelectedChoice, setNewSelectedChoice] = useState(selectedChoice);
  const settingVspdVoteChoices = useSelector(sel.setVspdVoteChoicesAttempt);
  const isLoading = settingVspdVoteChoices;

  const dispatch = useDispatch();
  const goBackHistory = useCallback(() => dispatch(cli.goBackHistory()), [
    dispatch
  ]);
  const onUpdateVotePreference = (agendaId, choiceId, passphrase) =>
    dispatch(cli.setVoteChoicesAttempt(agendaId, choiceId, passphrase));
  const updatePreferences = async (passphrase) => {
    await onUpdateVotePreference(agenda.name, newSelectedChoice, passphrase);
  };

  return {
    agenda,
    selectedChoice,
    newSelectedChoice,
    setNewSelectedChoice,
    choices,
    isLoading,
    goBackHistory,
    updatePreferences
  };
};

import { useState } from "react";
import VotingPrefs from "./Page";
import { find, compose, eq, get } from "fp";
import { useVotingPrefs } from "./hooks";

// TODO this agenda component needs some love.
const VotingPrefsTab = () => {
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const {
    configuredStakePools,
    defaultStakePool,
    stakePool,
    allAgendas,
    onUpdateVotePreference,
    onChangeStakePool,
    isLoading,
    voteChoices
  } = useVotingPrefs();

  const getStakePool = () => {
    const pool = onChangeStakePool && stakePool;
    return pool
      ? configuredStakePools.find(compose(eq(pool.Host), get("Host")))
      : null;
  };

  const getAgendaSelectedChoice = (agenda) =>
    get(
      ["choiceId"],
      find(compose(eq(agenda.name), get(["agendaId"])), voteChoices)
    ) || "abstain";

  const onShowAgenda = (index) => setSelectedAgenda(index);

  const onCloseAgenda = () => setSelectedAgenda(null);

  return (
    <VotingPrefs
      {...{
        selectedAgenda,
        defaultStakePool,
        allAgendas,
        onUpdateVotePreference,
        getAgendaSelectedChoice,
        onShowAgenda,
        onCloseAgenda,
        stakePool: getStakePool(),
        isLoading
      }}
    />
  );
};

export default VotingPrefsTab;

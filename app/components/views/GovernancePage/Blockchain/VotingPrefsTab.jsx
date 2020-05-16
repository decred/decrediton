import { useState } from "react";
import VotingPrefs from "./VotingPrefs";
import { votingPrefs } from "connectors";
import { find, compose, eq, get } from "fp";

const VotingPrefsTab = ({
  stakePool,
  onChangeStakePool,
  configuredStakePools,
  ...props
}) => {
  const [selectedAgenda, setSelectedAgenda] = useState(null);

  const getStakePool = () => {
    const pool = onChangeStakePool && stakePool;
    return pool
      ? configuredStakePools.find(compose(eq(pool.Host), get("Host")))
      : null;
  };

  const getAgendaSelectedChoice = (agenda) =>
    get(
      ["choiceId"],
      find(
        compose(eq(agenda.name), get(["agendaId"])),
        get("VoteChoices", getStakePool()) || []
      )
    ) || "abstain";

  const onShowAgenda = (index) => setSelectedAgenda(index);

  const onCloseAgenda = () => setSelectedAgenda(null);

  return (
    <VotingPrefs
      {...{
        ...props,
        selectedAgenda,
        getAgendaSelectedChoice,
        onShowAgenda,
        onCloseAgenda,
        stakePool: getStakePool()
      }}
    />
  );
};

export default votingPrefs(VotingPrefsTab);

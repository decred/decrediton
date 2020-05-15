import VotingPrefs from "./VotingPrefs";
import { votingPrefs } from "connectors";
import { find, compose, eq, get, substruct } from "fp";

@autobind
class VotingPrefsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stakePool: props.stakePool,
      selectedAgenda: null,
      isShowingDetails: false
    };
  }

  render() {
    console.log(this.getAgendaSelectedChoice);
    return (
      <VotingPrefs
        {...{
          ...this.props,
          ...this.state,
          stakePool: this.getStakePool(),
          ...substruct(
            {
              getAgendaSelectedChoice: null,
              onShowAgenda: null,
              onCloseAgenda: null
            },
            this
          )
        }}
      />
    );
  }

  getStakePool() {
    const pool = this.props.onChangeStakePool
      ? this.props.stakePool
      : this.state.stakePool;
    return pool
      ? this.props.configuredStakePools.find(
          compose(eq(pool.Host), get("Host"))
        )
      : null;
  }

  getAgendaSelectedChoice(agenda) {
    return (
      get(
        ["choiceId"],
        find(
          compose(eq(agenda.name), get(["agendaId"])),
          get("VoteChoices", this.getStakePool()) || []
        )
      ) || "abstain"
    );
  }

  onShowAgenda(index) {
    this.setState({ selectedAgenda: index });
  }

  onCloseAgenda() {
    this.setState({ selectedAgenda: null });
  }
}

export default votingPrefs(VotingPrefsTab);

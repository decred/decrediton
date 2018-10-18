import VotingPrefsPage from "./Page";
import { votingPrefs } from "connectors";
import { find, compose, eq, get, substruct } from "fp";

@autobind
class VotingPrefs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stakePool: props.stakePool,
      selectedAgenda: null,
      isShowingDetails: false
    };
  }

  render() {
    return (
      <VotingPrefsPage
        {...{
          ...this.props,
          ...this.state,
          stakePool: this.getStakePool(),
          ...substruct({
            onChangeStakePool: null,
            getAgendaSelectedChoice: null,
            onShowAgenda: null,
            onCloseAgenda: null,
            onUpdateVotePreference: null
          }, this)
        }}
      />
    );
  }

  getStakePool() {
    const pool = this.props.onChangeStakePool ? this.props.stakePool : this.state.stakePool;
    return pool
      ? this.props.configuredStakePools.find(compose(eq(pool.Host), get("Host")))
      : null;
  }

  onChangeStakePool(stakePool) {
    const { onChangeStakePool } = this.props;
    this.setState({ stakePool });
    onChangeStakePool && onChangeStakePool(stakePool);
  }

  getAgendaSelectedChoice(agenda) {
    return get([ "choiceId" ], find(
      compose(eq(agenda.getId()), get([ "agendaId" ])),
      get("VoteChoices", this.getStakePool()) || []
    )) || "abstain";
  }

  onShowAgenda(selectedAgenda) {
    this.setState({ selectedAgenda });
  }

  onCloseAgenda() {
    this.setState({ selectedAgenda: null });
  }

  onUpdateVotePreference(agendaId, choiceId) {
    this.props.onUpdateVotePreference(this.getStakePool().value, agendaId, choiceId);
  }
}

export default votingPrefs(VotingPrefs);

import Overview from "./Overview";
import AgendaCard from "./AgendaCard";

@autobind
class AgendaOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedChoiceId: this.props.selectedChoice,
      disabled: this.props.disabled
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedChoice != this.props.selectedChoice) {
      this.setState({ selectedChoiceId: this.props.selectedChoice });
    }
  }

  render() {
    const {
      agenda,
      onCloseAgenda,
      showVoteChoice,
      selectedChoice,
      onClick
    } = this.props;
    const { selectedChoiceId, disabled } = this.state;
    const { setSelecedChoiceId, updatePreferences } = this;
    const activeChoiceId = this.props.selectedChoice;
    const choices = agenda.choices.map((choice) => ({
      choiceId: choice.getId()
    }));
    const hasModifiedChoice = this.hasModifiedChoice();

    return showVoteChoice ? (
      <Overview
        {...{
          isFinished: agenda.finished,
          agendaId: agenda.name,
          agendaDescription: agenda.description,
          passed: agenda.passed,
          selectedChoiceId,
          activeChoiceId,
          hasModifiedChoice,
          choices,
          setSelecedChoiceId,
          updatePreferences,
          closeCurrentAgenda: onCloseAgenda,
          disabled
        }}
      />
    ) : (
      <AgendaCard {...{ onClick, agenda, selectedChoice }} />
    );
  }

  setSelecedChoiceId(selectedChoiceId) {
    this.setState({ selectedChoiceId });
  }

  hasModifiedChoice() {
    return this.state.selectedChoiceId !== this.props.selectedChoice;
  }

  updatePreferences() {
    if (!this.hasModifiedChoice()) return;
    this.props.onUpdateVotePreference(
      this.props.agenda.name,
      this.state.selectedChoiceId
    );
  }
}

export default AgendaOverview;

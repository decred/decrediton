import Overview from "./Overview";

@autobind
class AgendaOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedChoiceId: this.props.selectedChoice,
      disabled: this.props.disabled,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedChoice != this.props.selectedChoice) {
      this.setState({ selectedChoiceId: this.props.selectedChoice });
    }
  }

  render() {
    const { agenda, closeCurrentAgenda } = this.props;
    const { selectedChoiceId, disabled } = this.state;
    const { setSelecedChoiceId, updatePreferences } = this;
    const activeChoiceId = this.props.selectedChoice;
    const isFinished = agenda.finished;
    const agendaId = agenda.getId();
    const agendaDescription = agenda.getDescription();
    const choices = agenda.getChoicesList().map(choice => ({
      choiceId: choice.getId(),
    }));
    const hasModifiedChoice = this.hasModifiedChoice();

    return (
      <Overview
        {...{
          isFinished,
          agendaId,
          agendaDescription,
          selectedChoiceId,
          activeChoiceId,
          hasModifiedChoice,
          choices,
          setSelecedChoiceId,
          updatePreferences,
          closeCurrentAgenda,
          disabled
        }}
      />
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
    this.props.updatePreferences(this.props.agenda.getId(), this.state.selectedChoiceId);
  }
}

export default AgendaOverview;

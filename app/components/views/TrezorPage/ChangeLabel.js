import { VerticalAccordion } from "shared";
import { FormattedMessage as T } from "react-intl";
import { TextInput } from "inputs";
import { KeyBlueButton } from "buttons";

@autobind
class ChangeLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newLabel: "", show: false };
  }

  onChangeLabelClicked() {
    this.props.onChangeLabel(this.state.newLabel);
  }

  onNewLabelChanged(e) {
    this.setState({ newLabel: e.target.value });
  }

  onToggleAccordion() {
    this.setState({ show: !this.state.show });
  }

  render() {

    const changeLabelHeader = (
      <Aux>
        <T id="trezor.changeLabel.header" m="Change Label" />
      </Aux>
    );

    const { loading } = this.props;

    return (
      <VerticalAccordion
        height={100}
        header={changeLabelHeader}
        show={this.state.show}
        onToggleAccordion={this.onToggleAccordion}
        className="trezor-config-accordion"
      >
        <div><T id="trezor.changeLabel.description" m="New Label" /></div>
        <div>
          <TextInput
            value={this.state.newLabel}
            onChange={this.onNewLabelChanged}
          />
        </div>
        <div>
          <KeyBlueButton onClick={this.onChangeLabelClicked} disabled={loading} loading={loading} >
            <T id="trezor.changeLabel.changeButton" m="Change" />
          </KeyBlueButton>
        </div>
      </VerticalAccordion>

    );
  }
}

export default ChangeLabel;

import { VerticalAccordion } from "shared";
import { FormattedMessage as T } from "react-intl";
import { TextInput } from "inputs";
import { KeyBlueButton } from "buttons";

@autobind
class ChangeLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newLabel: "" };
  }

  onChangeLabelClicked() {
    this.props.onChangeLabel(this.state.newLabel);
  }

  onNewLabelChanged(e) {
    this.setState({ newLabel: e.target.value });
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
        className="trezor-config-accordion"
      >
        <Aux>
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
        </Aux>
      </VerticalAccordion>

    );
  }
}

export default ChangeLabel;

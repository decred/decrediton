import { Creatable } from "react-select";
import Select from "react-select";
import {  FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { newStakePool } from "connectors";

const messages = defineMessages({
  placeholder: {
    id: "selectStakepool.placeholder",
    defaultMessage: "Select Stakepool..."
  }
});

@autobind
class StakePoolSelect extends React.Component {

  constructor(props) {
    super(props);
    this.lastInput = "";
  }

  onChange(value) {
    if (!value || !value.Host) return;

    const { onChange, addCustomStakePool } = this.props;
    if (!onChange) return;

    if (value.newOption) {
      if (!addCustomStakePool) return;

      const formattedHost = value.Host.replace(/\/$/, "");
      addCustomStakePool(formattedHost).then(poolInfo => {
        if (!poolInfo) return;
        const opt = { ...poolInfo, label: poolInfo.Host, value: poolInfo,
          isVersionValid: true };
        onChange(opt);
      });
      return;
    }
    onChange(value);
  }

  addStakePoolLabel() {
    return <T id="stakePoolSelect.addNewPrompt" m="Add StakePool {host}"
      values={{ host: this.lastInput }} />;
  }

  newOptionCreator(obj) {
    return { label: obj.label, Host: this.lastInput, newOption: true };
  }

  onInputChange(input) {
    // not a state var because <Select> already accounts for it. It is used only
    // when a new stakepool is supposed to be added.
    this.lastInput = input;
  }

  getOptions() {
    if (!this.props.creatable || this.lastInput) return this.props.options;
    const options = [ ...this.props.options ];
    options.unshift({
      label: <T id="stakePoolSelect.addNewPromptEmpty" m="Type to add new Stake Pool" />,
      Host: null
    });
    return options;
  }

  isValidNewOption() {
    return true;
  }

  render() {
    const Component = this.props.creatable ? Creatable : Select;
    const options = this.getOptions();

    return (
      <Component
        {...this.props}
        options={options}
        placeholder={this.props.intl.formatMessage(messages.placeholder)}
        promptTextCreator={this.addStakePoolLabel}
        onChange={this.onChange}
        newOptionCreator={this.newOptionCreator}
        onInputChange={this.onInputChange}
        isValidNewOption={this.isValidNewOption}
      />
    );
  }
}

StakePoolSelect.defaultProps = {
  clearable: false,
};

export default injectIntl(newStakePool(StakePoolSelect));

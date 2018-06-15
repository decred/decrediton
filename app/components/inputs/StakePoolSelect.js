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
    if (!value) return;

    const { onChange, addCustomStakePool } = this.props;
    if (!onChange) return;

    if (value.newOption) {
      if (!addCustomStakePool) return;

      addCustomStakePool(value.Host).then(poolInfo => {
        if (!poolInfo) return;
        const opt = { ...poolInfo, label: poolInfo.Host, value: poolInfo,
          isVersionValid: true };
        onChange(opt);
      });
      return;
    }
    onChange(value);
  }

  addStakePoolLabel(host) {
    return <T id="stakePoolSelect.addNewPrompt" m="Add StakePool {host}" values={{ host }} />;
  }

  newOptionCreator({ label }) {
    return { label, Host: this.lastInput, newOption: true };
  }

  onInputChange(input) {
    // not a state var because <Select> already accounts for it. It is used only
    // when a new stakepool is supposed to be added.
    this.lastInput = input;
  }

  render() {
    const Component = this.props.creatable ? Creatable : Select;

    return (
      <Component
        {...this.props}
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

export default injectIntl(newStakePool(StakePoolSelect));

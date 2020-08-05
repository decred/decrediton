import Select from "react-select";
import { injectIntl, defineMessages } from "react-intl";
import { useState } from "react";
import * as vspa from "actions/VSPActions";
import { useDispatch } from "react-redux";
import { base64ToHex } from "helpers";

// TODO Finish building this component and workflow after integrating vspd to
// dcrwallet.
const messages = defineMessages({
  placeholder: {
    id: "selectStakepool.placeholder",
    defaultMessage: "Select VSP..."
  }
});

function VSPSelect({ className, onChange, options, intl }) {
  const dispatch = useDispatch();
  const getVSPInfo = (host) => dispatch(vspa.getVSPInfo(host));
  // TODO how treat add custom vsp?
  // const addCustomStakePool = () => dispatch(vspa.addCustomStakePool())
  const [selectedOption, setSelected] = useState(null);

  const handleOnChange = async (option) => {
    if (!option) return;
    const { value } = option;
    if (!value || !value.host) return;

    // TODO add loading state. (use state machine?)
    const info = await getVSPInfo(value.host);
    // TODO remove this hard coded value, get it dinamically.
    // depends on https://github.com/decred/dcrwebapi/pull/104
    const { pubkey } = info;
    const host = "teststakepool.decred.org";

    setSelected(option);
    onChange({ pubkey, host });
  };

  const getOptions = () => {
    if (!options) return;
    options = options.map((vsp) => ({
      label: vsp.host,
      value: vsp
    }));
    // TODO handle add new vsp dinamically

    // options.unshift({
    //   label: (
    //     <T id="stakePoolSelect.addNewPromptEmpty" m="Type to add new VSP" />
    //   ),
    //   Host: null
    // });
    return options;
  };

  return <Select
    options={getOptions()}
    placeholder={intl.formatMessage(messages.placeholder)}
    className={className}
    onChange={handleOnChange}
    value={selectedOption}
    // TODO handle add new vsp dinamically

    // newOptionCreator={
    //   {
    //     value: { Host: lastInput },
    //     label: lastInput,
    //     Host: lastInput,
    //     newOption: true
    //   }
    // }
    // onInputChange={this.onInputChange}
    // isValidNewOption={this.isValidNewOption}
  />;
}

export default injectIntl(VSPSelect);

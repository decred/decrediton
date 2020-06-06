import Select from "react-select";
import { injectIntl, defineMessages } from "react-intl";
import { useState } from "react";

const messages = defineMessages({
  placeholder: {
    id: "selectStakepool.placeholder",
    defaultMessage: "Select VSP..."
  }
});

function VSPSelect({ onChange, options, intl }) {
  // TODO how treat add custom vsp?
  // const addCustomStakePool = () => dispatch(vspa.addCustomStakePool())
  const [selectedOption, setSelected] = useState(null);

  const handleOnChange = (option) => {
    if (!option) return;
    const { value } = option;
    if (!value || !value.Host) return;

    // if (value.newOption) {
    //   const formattedHost = value.Host.replace(/\/$/, "");
    //   addCustomStakePool(formattedHost).then((poolInfo) => {
    //     if (!poolInfo) return;
    //     const opt = {
    //       ...poolInfo,
    //       label: poolInfo.Host,
    //       value: poolInfo,
    //       isVersionValid: true
    //     };
    //     onChange(opt);
    //   });
    //   return;
    // }
    setSelected(option);
    onChange(value);
  };

  const getOptions = () => {
    if (!options) return;
    options = options.map((vsp) => ({
      label: vsp.Host,
      value: vsp
    }));
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

    onChange={handleOnChange}
    value={selectedOption}
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

import Select from "react-select";
import { injectIntl, defineMessages } from "react-intl";
import { useEffect } from "react";
import { useVSPSelect } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import styles from "./VSPSelect.modules.css";

const messages = defineMessages({
  placeholder: {
    id: "selectStakepool.placeholder",
    defaultMessage: "Select VSP..."
  }
});

function VSPSelect({ onChange, options, intl }) {
  const { send, state, selectedOption, vspInfo } = useVSPSelect(options);
  // TODO how treat add custom vsp?
  // const addCustomStakePool = () => dispatch(vspa.addCustomStakePool())

  useEffect(() => {
    const { pubkey, host } = vspInfo;
    onChange && onChange({ pubkey, host });
  }, [vspInfo, onChange]);

  const handleOnChange = (option) => {
    if (!option) return;
    const { value } = option;
    if (!value || !value.host) return;
    send({ type: "FETCH", value });
  };

  const handleOnRetry = (option) => {
    if (!option) return;
    const { value } = option;
    if (!value || !value.host) return;
    send({ type: "RETRY", value });
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

  const getComponentState = (state) => {
    const stateValue = state.value;
    const { error } = state.context;
    switch (stateValue) {
      case "idle":
        return           <Select
        options={getOptions()}
        placeholder={intl.formatMessage(messages.placeholder)}

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
      case "loading":
        return (
          <div>
            <T id="vspselct.loading" m="Loading" />
          </div>
        );
      case "success":
        return (
          <Select
            options={getOptions()}
            placeholder={intl.formatMessage(messages.placeholder)}

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
          />
        );
      case "failure":
        return (
          <div>
            <Select
              options={getOptions()}
              placeholder={intl.formatMessage(messages.placeholder)}

              onChange={handleOnRetry}
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
            />
            <div className={styles.error}>{String(error)}</div>
          </div>
        );
      default:
        return null;
    }
  };

  return getComponentState(state);
}

export default injectIntl(VSPSelect);

import { Creatable } from "react-select";
import { injectIntl, defineMessages } from "react-intl";
import { useEffect, useState } from "react";
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

  const [newOption, setNewOption] = useState("");
  const [newOptions, setNewOptions] = useState([]);
  const [vspList, setVSPList] = useState([]);

  useEffect(() => {
    if (!options) return;
    options = options.map((vsp) => ({
      label: vsp.host,
      value: vsp
    }));
    options = [
      {
        label: (
          <T id="stakePoolSelect.addNewPromptEmpty" m="Type to add new VSP" />
        ),
        host: null
      },
      ...newOptions,
      ...options
    ];

    setVSPList(options);
  }, [options, newOptions])


  useEffect(() => {
    const { pubkey, host } = vspInfo;
    onChange && onChange({ pubkey, host });
  }, [vspInfo, onChange]);

  const handleOnChange = (option, isRetry) => {
    if (!option) return;
    const { value } = option;
    if (!value || !value.host) return;

    // push new value if it is a new vsp option.
    if (value.newOption) {
      const host = value.host;
      newOptions.push({
        host,
        label: host,
        value: host
      });

      setNewOptions(newOptions)
    }
    isRetry ? send({ type: "RETRY", value }) : send({ type: "FETCH", value });
  };

  const onSetNewOption = (input) => {
    // remove `htpp://` or `https://` case they exists.
    const newInput = input.replace(/https?:\/\/?/, "");

    // remove last `/` case exists.
    setNewOption(newInput.replace(/\/$/, ""));
  }

  const getSelect = (isRetry) => {
    return <Creatable
        options={vspList}
        placeholder={intl.formatMessage(messages.placeholder)}
        // className={className}
        onChange={(option) => handleOnChange(option, isRetry)}
        value={selectedOption}
        newOptionCreator={() => {
          return {
            value: { host: newOption, label: newOption },
            label: newOption,
            host: newOption,
            newOption: true
          }
        }}
        onInputChange={(input) => onSetNewOption(input)}
        isValidNewOption={() => !!newOption}
      />;
  }

  const getComponentState = (state) => {
    const stateValue = state.value;
    const { error } = state.context;
    switch (stateValue) {
      case "idle":
        return getSelect();
      case "loading":
        return (
          <div>
            <T id="vspselct.loading" m="Loading" />
          </div>
        );
      case "success":
        return getSelect();
      case "failure":
        return (
          <div>
            {getSelect(true)}
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

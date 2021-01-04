import { Creatable } from "react-select";
import { injectIntl, defineMessages } from "react-intl";
import { useEffect, useState, useMemo } from "react";
import { useVSPSelect } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import styles from "./VSPSelect.modules.css";

const messages = defineMessages({
  placeholder: {
    id: "selectStakepool.placeholder",
    defaultMessage: "Select VSP..."
  }
});

function VSPSelect({ onChange, options, intl, value, isDisabled, setVspFee }) {
  const { send, state, selectedOption, vspInfo, availableVSPs } = useVSPSelect(
    options,
    value,
    setVspFee
  );

  if (!options) {
    options = availableVSPs;
  }
  const [newOption, setNewOption] = useState("");
  const [newOptions, setNewOptions] = useState([]);
  const vspList = useMemo(() => {
    if (!options) return;
    let opts = options.map((vsp) => ({
      label: (
        <Tooltip
          className={styles.tooltip}
          contentClassName={styles.tooltipContent}
          content={
            <div>
              <T
                id="vsp.feeTooltip"
                m="Fee: {feePercentage} %"
                values={{
                  feePercentage: vsp.vspData.feepercentage
                }}
              />
            </div>
          }>
          {vsp.host}
        </Tooltip>
      ),
      value: vsp
    }));
    opts = [
      {
        label: <T id="vsp.addNewPromptEmpty" m="Type to add new VSP" />,
        host: null
      },
      ...newOptions,
      ...opts
    ];

    return opts;
  }, [options, newOptions]);

  useEffect(() => {
    const { host, pubkey } = vspInfo;
    if (!host || !pubkey) {
      return;
    }
    onChange && onChange({ host, pubkey });
  }, [onChange, vspInfo]);

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

      setNewOptions(newOptions);
    }
    isRetry ? send({ type: "RETRY", value }) : send({ type: "FETCH", value });
  };

  const onSetNewOption = (input) => {
    // remove `htpp://` or `https://` case they exists.
    const newInput = input.replace(/https?:\/\/?/, "");

    // remove last `/` case exists.
    setNewOption(newInput.replace(/\/$/, ""));
  };

  const getSelect = (isRetry) => {
    return (
      <Creatable
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
          };
        }}
        disabled={isDisabled}
        onInputChange={(input) => onSetNewOption(input)}
        isValidNewOption={() => !!newOption}
      />
    );
  };

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

  return <div className={styles.container}>{getComponentState(state)}</div>;
}

export default injectIntl(VSPSelect);

import { injectIntl, defineMessages } from "react-intl";
import { useEffect, useState, useMemo } from "react";
import { useVSPSelect } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import styles from "./VSPSelect.modules.css";
import { Select } from "inputs";

const messages = defineMessages({
  placeholder: {
    id: "selectStakepool.placeholder",
    defaultMessage: "Select VSP..."
  }
});

const getError = (error) => {
  if (error.isTimeout) {
    const { vspHost } = error;
    return (
      <T
        id="vsp.select.error"
        m="Timeout with vsp: {vsp}"
        values={{
          vsp: vspHost
        }}
      />
    );
  }

  return String(error);
};

function VSPSelect({
  onChange,
  options,
  intl,
  value,
  isDisabled,
  setVspFee,
  selectWithBigFont
}) {
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
          <div className={styles.optionWrapper}>{vsp.host}</div>
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
      setNewOptions((opts) => [
        ...opts,
        {
          value: {
            host,
            label: host,
            value: host
          },
          label: host
        }
      ]);
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
      <Select
        isCreatable
        isSearchable
        selectWithBigFont={selectWithBigFont}
        options={vspList}
        isClearable={!!newOption}
        placeholder={intl.formatMessage(messages.placeholder)}
        onChange={(option) => handleOnChange(option, isRetry)}
        value={selectedOption}
        onCreateOption={(option) =>
          handleOnChange(
            {
              value: { host: option, label: option, newOption: true }
            },
            isRetry
          )
        }
        isDisabled={isDisabled}
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
            <div className={styles.error}>{getError(error)}</div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className={styles.container}>{getComponentState(state)}</div>;
}

export default injectIntl(VSPSelect);

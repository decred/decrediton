import { useCallback, useState } from "react";
import { useMountEffect } from "hooks";
import { EyeFilterMenu } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { Slider, NumberInput } from "pi-ui";
import { DCR } from "constants";
import { debounce } from "lodash";
import styles from "./EyeFilterMenuWithSlider.module.css";

const EyeFilterMenuWithSliderMenu = ({
  maxFilterValue,
  minFilterValue,
  unitDivisor,
  currencyDisplay,
  onChangeSlider
}) => {
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(100);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [expandedSliderInfo, setExpandedSliderInfo] = useState(false);

  useMountEffect(() => {
    if (maxFilterValue) {
      const maxValue =
        currencyDisplay === DCR ? maxFilterValue / unitDivisor : maxFilterValue;
      setMaxAmount(maxValue);
      if (maxValue > max) {
        setMax(maxValue);
      }
    }
    if (minFilterValue) {
      const minValue =
        currencyDisplay === DCR ? minFilterValue / unitDivisor : minFilterValue;
      setMinAmount(minValue);
      if (minValue > min) {
        setMin(minValue);
      }
    }
  });

  const onChangeSliderCallback = useCallback(
    debounce((value, limit) => {
      onChangeSlider(value, limit);
    }, 100),
    [onChangeSlider]
  );

  const setMinAmountCallback = (value) => {
    setMinAmount(value);
    onChangeSliderCallback(value, "min");
  };

  const setMaxAmountCallback = (value) => {
    setMaxAmount(value);
    onChangeSliderCallback(value, "max");
  };

  const setExpandedSliderInfoCallback = () =>
    setExpandedSliderInfo(!expandedSliderInfo);

  return (
    <div className={styles.rangeContainer}>
      <div className={styles.rangeLabel}>
        <T id="history.amount.range" m="Amount Range" />
        <span
          onClick={setExpandedSliderInfoCallback}
          className={styles.kebab}></span>
      </div>
      <Slider
        double={true}
        axis={"x"}
        max={max}
        min={min}
        className={styles.slider}
        handles={[
          {
            value: minAmount,
            onChange: setMinAmountCallback,
            className: styles.handle
          },
          {
            value: maxAmount,
            onChange: setMaxAmountCallback,
            className: styles.handle
          }
        ]}
      />
      <div className={styles.amountsArea}>
        {expandedSliderInfo && (
          <div>
            <div>
              <T id="history.min.value" m="Slider min" />:
              <NumberInput
                value={min}
                min={0}
                inputClassNames={styles.numberInput}
                onChange={(e) => {
                  const newLimit = parseInt(e.target.value);
                  if (newLimit < max) setMin(newLimit);
                }}
              />
            </div>
            <div>
              <T id="history.max.value" m="Slider max" />:
              <NumberInput
                value={max}
                inputClassNames={styles.numberInput}
                onChange={(e) => {
                  const newLimit = parseInt(e.target.value);
                  if (newLimit > min) setMax(newLimit);
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div className={styles.valueShower}>
        {minAmount} {currencyDisplay} - {maxAmount} {currencyDisplay}
      </div>
    </div>
  );
};

const EyeFilterMenuWithSlider = ({
  maxFilterValue,
  minFilterValue,
  unitDivisor,
  currencyDisplay,
  onChangeSlider,
  ...props
}) => (
  <EyeFilterMenu {...{ ...props }}>
    <EyeFilterMenuWithSliderMenu
      {...{
        maxFilterValue,
        minFilterValue,
        unitDivisor,
        currencyDisplay,
        onChangeSlider
      }}
    />
  </EyeFilterMenu>
);

export default EyeFilterMenuWithSlider;

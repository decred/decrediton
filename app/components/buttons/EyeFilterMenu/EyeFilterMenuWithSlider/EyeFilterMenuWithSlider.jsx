import { useState, useCallback } from "react";
import { useMountEffect } from "hooks";
import { EyeFilterMenu } from "buttons";
import { FormattedMessage as T } from "react-intl";
import noUiSlider from "nouislider";
import { NumericInput } from "inputs";
import { DCR } from "constants";
import styles from "./EyeFilterMenuWithSlider.module.css";

const EyeFilterMenuWithSlider = ({
  maxFilterValue,
  minFilterValue,
  unitDivisor,
  currencyDisplay,
  onChangeSlider,
  ...props
}) => {
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(100);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [sliderShower, setSliderShower] = useState(true);
  const [expandedSliderInfo, setExpandedSliderInfo] = useState(false);
  const [rangeSlider, setRangeSlider] = useState(null);

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

  const mountSliderRangeInElement = useCallback(
    (range) => {
      setTimeout(() => {
        if (!range) {
          return;
        }

        const toolTipFormatter = {
          to: (value) => {
            return value;
          }
        };

        if (!rangeSlider) {
          noUiSlider.create(range, {
            start: [minAmount, maxAmount],
            range: {
              min: [parseInt(min)],
              max: [parseInt(max)]
            },
            step: 1,
            connect: true,
            tooltips: [true, toolTipFormatter]
          });
          setRangeSlider(range);

          range.noUiSlider.on("set", (values, handle) => {
            const value = parseInt(values[handle]);
            if (handle) {
              onChangeSlider(value, "max");
              setMaxAmount(value);
            } else {
              setMinAmount(value);
              onChangeSlider(value, "min");
            }
          });

          range.noUiSlider.on("update", (values, handle) => {
            const value = parseInt(values[handle]);
            if (handle) {
              setMaxAmount(value);
            } else {
              setMinAmount(value);
            }
          });
        }
      }, 25);
    },
    [max, min, maxAmount, minAmount, onChangeSlider, rangeSlider]
  );

  const unmountSliderRangeInElement = () => {
    setRangeSlider(null);
  };

  const onToggleSliderShower = useCallback(
    () => setSliderShower(!sliderShower),
    [sliderShower, setSliderShower]
  );

  const onToggleSliderInfo = useCallback(
    () => setExpandedSliderInfo(!expandedSliderInfo),
    [expandedSliderInfo, setExpandedSliderInfo]
  );

  const slider = rangeSlider && rangeSlider.noUiSlider;

  const onChangeMinValue = useCallback(
    (min) => {
      setMin(min);
      const intMin = isNaN(parseInt(min)) ? 0 : parseInt(min);
      slider.updateOptions({
        range: {
          min: [intMin],
          max: [parseInt(max)]
        }
      });
    },
    [max, slider]
  );

  const onChangeMaxValue = useCallback(
    (max) => {
      setMax(max);
      const intMax = isNaN(parseInt(max)) ? 0 : parseInt(max);
      slider.updateOptions({
        range: {
          min: [parseInt(min)],
          max: [intMax]
        }
      });
    },
    [min, slider]
  );

  const getSliderWhenOpenedMenu = useCallback(
    () => (
      <div>
        <div className={styles.rangeLabel}>
          <T id="history.amount.range" m="Amount Range" />
        </div>
        <div
          ref={(r) => mountSliderRangeInElement(r)}
          className={styles.minMaxSlider}></div>
        <div className={styles.amountsArea}>
          <div>
            <span
              onClick={() => onToggleSliderInfo()}
              className={styles.kebab}></span>
          </div>
          {expandedSliderInfo && (
            <div>
              <div>
                <T id="history.min.value" m="Slider min" />:
                <NumericInput
                  value={min}
                  onChange={(e) => onChangeMinValue(e.target.value)}
                />
              </div>
              <div>
                <T id="history.max.value" m="Slider max" />:
                <NumericInput
                  value={max}
                  onChange={(e) => onChangeMaxValue(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        {sliderShower && (
          <div className={styles.valueShower}>
            {minAmount} {currencyDisplay} - {maxAmount} {currencyDisplay}
            <div
              className={styles.valueShowerCloser}
              onClick={() => onToggleSliderShower()}></div>
          </div>
        )}
      </div>
    ),
    [
      sliderShower,
      currencyDisplay,
      expandedSliderInfo,
      max,
      maxAmount,
      min,
      minAmount,
      mountSliderRangeInElement,
      onChangeMaxValue,
      onChangeMinValue,
      onToggleSliderInfo,
      onToggleSliderShower
    ]
  );

  return (
    <EyeFilterMenu
      {...{
        sliderShower,
        expandedSliderInfo,
        min,
        max,
        maxAmount,
        minAmount,
        ...props
      }}
      getOpenedMenu={getSliderWhenOpenedMenu}
      unmountMenu={unmountSliderRangeInElement}
    />
  );
};

export default EyeFilterMenuWithSlider;

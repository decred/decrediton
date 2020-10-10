import { EyeFilterMenu } from "buttons";
import { FormattedMessage as T } from "react-intl";
import noUiSlider from "nouislider";
import { NumericInput } from "inputs";
import { DCR } from "constants";
import styles from "./EyeFilterMenuWithSlider.module.css";

@autobind
class EyeFilterMenuWithSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minAmount: 0,
      maxAmount: 100,
      min: 0,
      max: 100,
      sliderShower: true,
      expandedSliderInfo: false,
      rangeSlider: null
    };
  }

  componentDidMount() {
    const {
      maxFilterValue,
      minFilterValue,
      unitDivisor,
      currencyDisplay
    } = this.props;
    if (maxFilterValue) {
      const maxValue =
        currencyDisplay === DCR ? maxFilterValue / unitDivisor : maxFilterValue;
      this.setState({ maxAmount: maxValue });
      if (maxValue > this.state.max) {
        this.setState({ max: maxValue });
      }
    }
    if (minFilterValue) {
      const minValue =
        currencyDisplay === DCR ? minFilterValue / unitDivisor : minFilterValue;
      this.setState({ minAmount: minValue });
      if (minValue > this.state.min) {
        this.setState({ min: minValue });
      }
    }
  }

  mountSliderRangeInElement(range) {
    setTimeout(() => {
      if (!range) {
        return;
      }

      const { rangeSlider, minAmount, maxAmount, min, max } = this.state;
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
        this.setState({ rangeSlider: range });

        range.noUiSlider.on("set", (values, handle) => {
          const value = parseInt(values[handle]);
          if (handle) {
            this.props.onChangeSlider(value, "max");
            this.setState({ maxAmount: value });
          } else {
            this.setState({ minAmount: value });
            this.props.onChangeSlider(value, "min");
          }
        });

        range.noUiSlider.on("update", (values, handle) => {
          const value = parseInt(values[handle]);
          if (handle) {
            this.setState({ maxAmount: value });
          } else {
            this.setState({ minAmount: value });
          }
        });
      }
    }, 25);
  }

  unmountSliderRangeInElement() {
    this.setState({ rangeSlider: null });
  }

  getSliderWhenOpenedMenu() {
    const { currencyDisplay } = this.props;

    const {
      sliderShower,
      expandedSliderInfo,
      min,
      max,
      maxAmount,
      minAmount
    } = this.state;

    return (
      <div>
        <div className={styles.rangeLabel}>
          <T id="history.amount.range" m="Amount Range" />
        </div>
        <div
          ref={(r) => this.mountSliderRangeInElement(r)}
          className={styles.minMaxSlider}></div>
        <div className={styles.amountsArea}>
          <div>
            <span
              onClick={() => this.onToggleSliderInfo()}
              className={styles.kebab}></span>
          </div>
          {expandedSliderInfo && (
            <div>
              <div>
                <T id="history.min.value" m="Slider min" />:
                <NumericInput
                  value={min}
                  onChange={(e) => this.onChangeMinValue(e.target.value)}
                />
              </div>
              <div>
                <T id="history.max.value" m="Slider max" />:
                <NumericInput
                  value={max}
                  onChange={(e) => this.onChangeMaxValue(e.target.value)}
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
              onClick={() => this.onToggleSliderShower()}></div>
          </div>
        )}
      </div>
    );
  }

  onChangeMinValue(min) {
    const { rangeSlider, max } = this.state;
    this.setState({ min });
    const intMin = isNaN(parseInt(min)) ? 0 : parseInt(min);
    rangeSlider.noUiSlider.updateOptions({
      range: {
        min: [intMin],
        max: [parseInt(max)]
      }
    });
  }

  onChangeMaxValue(max) {
    const { rangeSlider, min } = this.state;
    this.setState({ max });
    const intMax = isNaN(parseInt(max)) ? 0 : parseInt(max);
    rangeSlider.noUiSlider.updateOptions({
      range: {
        min: [parseInt(min)],
        max: [intMax]
      }
    });
  }

  onToggleSliderShower() {
    this.setState({ sliderShower: !this.state.sliderShower });
  }

  onToggleSliderInfo() {
    this.setState({ expandedSliderInfo: !this.state.expandedSliderInfo });
  }

  render() {
    return (
      <EyeFilterMenu
        {...{ ...this.state, ...this.props }}
        getOpenedMenu={this.getSliderWhenOpenedMenu}
        unmountMenu={this.unmountSliderRangeInElement}
      />
    );
  }
}

export default EyeFilterMenuWithSlider;

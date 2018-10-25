import { EyeFilterMenu } from "buttons";
import { FormattedMessage as T } from "react-intl";
import "style/EyeFilterMenu.less";
import "style/MiscComponents.less";
import noUiSlider from "nouislider";
import {  NumericInput } from "inputs";

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

  mountSliderRangeInElement(range) {
    setTimeout(() => {
      if (!range) {
        return;
      }

      const { rangeSlider, minAmount, maxAmount, min, max } = this.state;
      const toolTipFormatter = {
        to: (value) => {
          return value.toFixed(2);
        },
      };

      if(!rangeSlider) {
        const slider = noUiSlider.create(range, {
          start: [ minAmount, maxAmount ],
          range: {
            "min": [ min ],
            "max": [ max ]
          },
          step: 1,
          connect: true,
          tooltips: [ true, toolTipFormatter ],
        });
        this.setState({ rangeSlider: slider });

        range.noUiSlider.on("end", (values, handle) => {
          const value = values[handle];
          if (handle) {
            this.props.onChangeSlider(value, "max");
            this.setState({ maxAmount: value });
          } else {
            this.setState({ minAmount: value });
            this.props.onChangeSlider(value, "min");
          }
        });

        range.noUiSlider.on("update", (values, handle) => {
          const value = values[handle];
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

    const { sliderShower, expandedSliderInfo,
      min, max, maxAmount, minAmount } = this.state;

    return (
      <div className="history-slider-wrapper">
        <div className="history-amount-range-label"><T id="history.amount.range" m="Amount Range" /></div>
        <div ref={r => this.mountSliderRangeInElement(r)} className="min-max-slider"></div>
        <div className="history-select-tx-amounts-area">
          <div className="history-select-tx-amounts">
            <span onClick={() => this.onToggleSliderInfo()} className="history-select-tx-kebab"></span>
          </div>
          {
            expandedSliderInfo && (
              <div className="history-select-tx-slider-info">
                <div>
                  <T id="history.min.value" m="Slider min" />:
                  <NumericInput value={min} onChange={(e) => this.onChangeMinValue(e.target.value)} />
                </div>
                <div>
                  <T id="history.max.value" m="Slider max" />:
                  <NumericInput value={max} onChange={(e) => this.onChangeMaxValue(e.target.value)} />
                </div>
              </div>
            )
          }
        </div>
        {
          sliderShower && (
            <div className="history-slider-value-shower">
              {minAmount} {currencyDisplay} - {maxAmount} {currencyDisplay}
              <div className="history-slider-value-shower-closer"
                onClick={() => this.onToggleSliderShower()}></div>
            </div>
          )
        }
      </div>
    );
  }

  onChangeMinValue(min) {
    const { rangeSlider, max } = this.state;
    const intMin = parseInt(min);
    this.setState({ min: intMin });
    rangeSlider.noUiSlider.updateOptions({
      range: {
        "min": [ intMin ],
        "max": [ max ]
      }
    });
  }

  onChangeMaxValue(max) {
    const { rangeSlider, min } = this.state;
    const intMax = parseInt(max);
    this.setState({ max: intMax });
    rangeSlider.noUiSlider.updateOptions({
      range: {
        "min": [ min ],
        "max": [ intMax ]
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
        {...{ ...this.state,...this.props, }}
        getOpenedMenu = {this.getSliderWhenOpenedMenu}
        unmountMenu = {this.unmountSliderRangeInElement}
      />
    );
  }
}

export default EyeFilterMenuWithSlider;

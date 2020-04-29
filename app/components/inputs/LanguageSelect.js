import Select from "react-select";
import { injectIntl } from "react-intl";
import "style/Input.less";

@autobind
class SettingsInput extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      this.setState({ value: value });
    }
  }

  render() {
    const { className, valueKey, labelKey, options } = this.props;

    return (
      <div className={className}>
        <Select
          clearable={false}
          multi={false}
          value={this.state.value}
          valueKey={valueKey}
          labelKey={labelKey}
          options={options}
          valueRenderer={this.valueRenderer}
          optionRenderer={this.valueRenderer}
          onChange={this.onChangeSelect}
          onInputKeyDown={this.selectKeyDown}
        />
      </div>
    );
  }

  selectKeyDown(e) {
    switch (e.keyCode) {
      case 8:
      case 46:
        e.preventDefault();
        break;
    }
  }

  valueRenderer(option) {
    return (
      <div className="language-label">
        <div className={"flag " + option.language} />
        <div className="name">{option.description}</div>
      </div>
    );
  }

  onChangeSelect(value) {
    this.setState({ value: value });
    this.props.onChange(value);
  }
}

export default injectIntl(SettingsInput);

import Select from "react-select";
import { injectIntl, intlShape } from "react-intl";
import "style/Input.less";

@autobind
class SettingsInput extends React.Component {

  static propTypes = {
    intl: intlShape.isRequired,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  componentWillMount() {
    const { value } = this.props;
    if(value) {
      this.setState({ value: value });
    }
  }

  render() {
    const {
      className, valueKey, labelKey, options
    } = this.props;

    return (
      <div className={className}>
        <Select
          clearable={false}
          multi={false}
          value={this.state.value}
          valueKey={valueKey}
          labelKey={labelKey}
          options={options}
          onChange={this.onChangeSelect}
        />
      </div>
    );
  }

  onChangeSelect(value){
    this.setState({ value: value });
    this.props.onChange(value);
  }

}

export default injectIntl(SettingsInput);

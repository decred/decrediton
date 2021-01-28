import Select from "react-select";
import { injectIntl } from "react-intl";
import "style/Input.less"; // XXXXXX: consider ditching this dep isit still working with the new css module ? :thinking:
import { classNames } from "pi-ui";
import styles from "./LanguageSelectInput.module.css";

// XXX: functional component

@autobind
class LanguageSelectInput extends React.Component {
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
    const { valueKey, labelKey, options, className, ariaLabelledBy } = this.props;

    return (
      <div className={classNames(styles.input, className)}>
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
          aria-labelledby={ariaLabelledBy}
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
      <div className={styles.label}>
        <div className={classNames(styles.flag, styles[option.language])} />
        <div className={styles.name}>{option.description}</div>
      </div>
    );
  }

  onChangeSelect(value) {
    this.setState({ value: value });
    this.props.onChange(value);
  }
}

export default injectIntl(LanguageSelectInput);

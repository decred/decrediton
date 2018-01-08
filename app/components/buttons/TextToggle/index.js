import Toggle from "./Toggle";

@autobind
class TextToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeButton: this.props.activeButton,
    };
  }

  onClick(activeButton) {
    this.setState({ activeButton });
    this.props.toggleAction(activeButton);
  }

  render() {
    const { leftText, rightText, type } = this.props;
    const { activeButton } = this.state;
    const { onClick } = this;

    return (
      <Toggle {...{ leftText, rightText, activeButton, onClick, type }} />
    );
  }
}

export default TextToggle;

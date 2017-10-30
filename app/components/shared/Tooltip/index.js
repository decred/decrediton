import ReactDOM from "react-dom";
import { BaseBox } from "../grid/Box";
import Tip from "./Tip";

const tooltip = document.getElementById("tooltip");
tooltip.style.position = "fixed";

const onMouseMove = ({clientX, clientY}) => {
  tooltip.style.left =
    clientX + tooltip.clientWidth + 10 < window.innerWidth ?
    clientX + 10 + "px" : window.innerWidth - 5 - tooltip.clientWidth + "px";
  tooltip.style.top =
    clientY + tooltip.clientHeight + 10 < window.innerHeight ?
    clientY + 10 + "px" : window.innerHeight + 5 - tooltip.clientHeight + "px";
};

@autobind
class Tooltip extends React.Component {
  constructor (props) { super(props); }
  state = { show: false }
  show () { this.setState({ show: true }); }
  hide () { this.setState({ show: false }); }
  render () {
    const { text, tipWidth, tipWarning, tipDisabled, ...rest } = this.props;
    return (
      <Aux>
        <BaseBox onMouseEnter={ this.show } onMouseLeave={ this.hide } {...{ onMouseMove, ...rest }}/>
        { this.state.show && !tipDisabled && ReactDOM.createPortal(<Tip {...{ tipWarning, tipWidth }}>{ text }</Tip>, tooltip) }
      </Aux>
    );
  }
}

Tooltip.propTypes = {
  children: PropTypes.element.isRequired
};

export default Tooltip;

import TransitionMotionWrapper from "./TransitionMotionWrapper";
import { spring } from "react-motion";

@autobind
class VerticalAccordion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shownStyles: this.chosenStyles(props, false),
    };
  }

  componentDidUpdate(prevProps) {
    const needUpdate =
      (prevProps.show !== this.props.show) ||
      (prevProps.children !== this.props.children) ||
      (prevProps.height !== this.props.height);

    if (needUpdate) {
      this.setState({
        shownStyles: this.chosenStyles(this.props, this.props.show),
      });
    }
  }

  // Style when body is hidden
  getNullStyles() {
    return [ {
      data: <div />,
      key: "body",
      style: {
        height: spring(0, { stiffness: 90, damping: 16 }),
        opacity: spring(0, { stiffness: 30, damping: 15 }),
      }
    } ];
  }

  // "default" style when initializing the component
  getDefaultStyles() {
    return [ {
      key: "body",
      style: {
        height: 0,
        opacity: 0
      }
    } ];
  }

  // style when body is shown. You need to specify props because this might be
  // changing due to caller changing eg content of body.
  getShownStyles(props) {
    return [ {
      data: React.isValidElement(props.children) ? props.children : <Aux>{props.children}</Aux>,
      key: "body",
      style: {
        height: spring(props.height || 100, { stiffness: 110, damping: 14 }),
        opacity: spring(1, { stiffness: 65, damping: 35 }),
      }
    } ];
  }

  // this returns the chosen style based on the passed props
  chosenStyles(props, show) {
    if (show && props.children) {
      return this.getShownStyles(props);
    } else {
      return this.getNullStyles();
    }
  }

  onToggleAccordion() {
    this.props.onToggleAccordion && this.props.onToggleAccordion();
  }

  render() {
    const classNames = [
      "vertical-accordion",
      this.props.show ? "active" : "",
      this.props.className || "",
    ].join(" ");

    return (
      <div className={classNames}>
        <div className="vertical-accordion-header" onClick={this.onToggleAccordion} >
          {this.props.header}
          <div className="vertical-accordion-arrow" />
        </div>

        <div className="vertical-accordion-body">
          <TransitionMotionWrapper
            styles={this.state.shownStyles}
            defaultStyles={this.getDefaultStyles()}
          />
        </div>
      </div>
    );
  }
}

export default VerticalAccordion;

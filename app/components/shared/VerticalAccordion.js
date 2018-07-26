import TransitionMotionWrapper from "./TransitionMotionWrapper";
import { spring } from "react-motion";

/**
 * A vertical accordion. Can be used in two modes:
 *
 * 1. Standalone: Provide header, height, and children props to render. It will
 *    be expanded/contracted when the header is clicked.
 *
 * 2. Group: Provide the previous props + groupKey, activeGroupKey and
 *    onToggleAccordion. Then the accordion will be expanded only when
 *    activeGroupKey === groupKey. onToggleAccordion will be triggered once the
 *    accordion header is clicked.
 */
@autobind
class VerticalAccordion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      shownStyles: this.chosenStyles(props, false),
    };
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.groupKey !== undefined) && this.props.onToggleAccordion) {
      const show = nextProps.groupKey === nextProps.activeGroupKey;
      this.setState({ shownStyles: this.chosenStyles(nextProps, show), show });
    } else {
      this.setState({ shownStyles: this.chosenStyles(nextProps, this.state.show) });
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
    if ((this.props.groupKey !== undefined) && this.props.onToggleAccordion) {
      this.props.onToggleAccordion(this.props.groupKey, this.state.show);
    } else {
      this.setState({
        show: !this.state.show,
        shownStyles: this.chosenStyles(this.props, !this.state.show),
      });
    }
  }

  render() {
    const classNames = [
      "vertical-accordion",
      this.state.show ? "active" : "",
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

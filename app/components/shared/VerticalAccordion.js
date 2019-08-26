import { createElement as h } from "react";
import { TransitionMotion } from "react-motion";
import { spring } from "react-motion";

@autobind
class VerticalAccordion extends React.Component {
  constructor(props) {
    super(props);
    this.childRef = null;
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

  // this returns the chosen style based on the passed props
  chosenStyles() {
    const { show, children } = this.props;
    if (show && children) {
      return [ {
        data: children,
        key: "body",
        style: {
          height: spring(this.childRef && this.childRef.clientHeight),
          opacity: spring(1),
        }
      } ];
    } else {
      return [ {
        data: <div />,
        key: "body",
        style: {
          height: spring(0),
          opacity: spring(0),
        }
      } ];
    }
  }

  onToggleAccordion() {
    this.props.onToggleAccordion && this.props.onToggleAccordion();
  }

  render() {
    const { disabled, className, show } = this.props;

    const classNames = [
      "vertical-accordion",
      show ? "active" : "",
      className || "",
    ].join(" ");
    const defaultStyles = this.getDefaultStyles();
    const styles = this.chosenStyles();
    const tmProps = { defaultStyles, styles };
    const childrenMotion = children => h("div", { className: classNames, }, children.map(({ key, style, data }) => {
      const childProps = { ...{ key }, style };
      return h("div", childProps,
        h("div", { ref: el => el && (this.childRef = el) }, data)
      );
    }));

    return (
      <div className={classNames}>
        <div className="vertical-accordion-header" onClick={ !disabled ? this.onToggleAccordion : null } >
          {this.props.header}
          <div className={(disabled && "disabled") + " vertical-accordion-arrow"} />
        </div>
        { h(TransitionMotion, tmProps, childrenMotion) }
      </div>
    );
  }
}

export default VerticalAccordion;

import { createElement as h, useState, useCallback } from "react";
import { TransitionMotion } from "react-motion";
import { spring } from "react-motion";

const AnimatedContainer = ({
  show,
  children,
  childrenClassName
}) => {
  const [childHeight, setChildHeight] = useState(0);
  const childRef = useCallback(
    (node) => {
      if (node !== null && childHeight != node.clientHeight) {
        setChildHeight(node.clientHeight);
      }
    },
    [childHeight]
  );

  // "default" style when initializing the component
  const getDefaultStyles = () => {
    return [
      {
        key: "body",
        style: {
          height: 0,
          opacity: 0
        }
      }
    ];
  };

  // this returns the chosen style based on the passed props
  const chosenStyles = () => {
    if (show) {
      return [
        {
          data: children,
          key: "body",
          style: {
            height: spring(childHeight, {
              stiffness: 180,
              damping: 20
            }),
            opacity: spring(1)
          }
        }
      ];
    }
    // if we do not return the children we return an empty div.
    return [
      {
        data: <div />,
        key: "body",
        style: {
          height: spring(0, { stiffness: 180, damping: 20 }),
          opacity: spring(0)
        }
      }
    ];
  };

  const defaultStyles = getDefaultStyles();
  const choosenStyles = chosenStyles();
  const tmProps = { defaultStyles, styles: choosenStyles };
  const childrenMotion = (children) =>
    h(
      "div",
      {},
      children.map(({ key, style, data }) => {
        const childProps = { ...{ key }, style };
        return h(
          "div",
          childProps,
          h(
            "div",
            { ref: (el) => el && childRef(el), className: childrenClassName },
            data
          )
        );
      })
    );

  return (
    <>
      {h(TransitionMotion, tmProps, childrenMotion)}
    </>
  );
};

export default AnimatedContainer;

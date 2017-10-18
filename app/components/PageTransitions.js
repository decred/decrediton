// @flow
import { withTransition } from "react-router-transitions";
import { applyRouterMiddleware } from "react-router";
import { useTransitions } from "react-router-transitions";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

const defaultPageTransition = {
  transitionName: "fade",
  component: "div",
  transitionEnterTimeout: 500,
  transitionLeaveTimeout: 300
};

export function pageTransitionsRender() {
  return applyRouterMiddleware(useTransitions({
    TransitionGroup: ReactCSSTransitionGroup,
    defaultTransition: defaultPageTransition
  }));
}

// withTabSlide is a HOC to add a transition to slide between routes as if they
// were tabs. Used with the TabbedPage component. The ROUTEs that are used for
// each tab must have a "position" attribute so the transition can choose between
// sliding right-to-left or left-to-right.
export function withTabSlide(component) {
  const replaceFunc = (prevState, nextState, replace) => {
    const prevPosition = prevState.routes[prevState.routes.length-1].position || 0;
    const nextPosition = nextState.routes[nextState.routes.length-1].position || 0;
    const transtionName = (nextPosition > prevPosition) ? "fromright" : "fromleft";

    replace({
      component: "div",
      transitionName: transtionName,
      transitionEnterTimeout: 210,
      transitionLeaveTimeout: 210,
    });
  };

  return withTransition(
    component, {
      onShow: (prevState, nextState, replace) => {
        replaceFunc(prevState, nextState, replace);
      },
      onDismiss: (prevState, nextState, replace) => {
        replaceFunc(prevState, nextState, replace);
      },
      defaultTransition: defaultPageTransition
    }
  );
}

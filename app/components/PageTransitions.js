// @flow
import React from "react";
import { withTransition } from "react-router-transitions";

// withTabSlide is a HOC to add a transition to slide between routes as if they
// were tabs. Used with the TabbedPage component. The ROUTEs that are used for
// each tab must have a "position" attribute so the transition can choose between
// sliding right-to-left or left-to-right.
export function withTabSlide(component) {
  return withTransition(
    component, {
      onShow: (prevState, nextState, replace) => {
        const prevPosition = prevState.routes[prevState.routes.length-1].position || 0;
        const nextPosition = nextState.routes[nextState.routes.length-1].position || 0;

        const transition = {
          transitionName: "fromleft",
          transitionEnterTimeout: 500,
          transitionLeaveTimeout: 500, component: "div"
        }

        if (nextPosition > prevPosition) transition.transitionName = "fromright"
        else transition.transitionName = "fromleft";
        replace(transition);
      },

      defaultTransition: {
        transitionName: "fromleft",
        transitionEnterTimeout: 500,
        transitionLeaveTimeout: 500, component: "div"
      }
    }
  );
}
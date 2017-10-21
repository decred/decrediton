import { provideState, update } from "freactal";
import { spring } from "react-motion";

export default provideState({
  initialState: () => ({
    tooltipLeft: 400,
    tooltipTop: 400,
    tooltipOpacity: 0,
  }),
  effects: {
    updatePosition: update((state, tooltip, mouseX, mouseY) => {
      const tooltipLeft =
        mouseX + tooltip.clientWidth + 10 < window.innerWidth ?
        mouseX + 10 : window.innerWidth + 5 - tooltip.clientWidth;
      const tooltipTop =
        mouseY + tooltip.clientHeight + 10 < window.innerHeight ?
        mouseY + 10 : window.innerHeight + 5 - tooltip.clientHeight;
      return ({ tooltipLeft, tooltipTop });
    }),
    onMouseEnter: update({ tooltipOpacity: 1 }),
    onMouseLeave: update({ tooltipOpacity: 0 })
  },
  computed: {
    position: ({ tooltipLeft, tooltipTop, tooltipOpacity }) => (
      {
        top: spring(tooltipTop),
        left: spring(tooltipLeft),
        opacity: spring(tooltipOpacity)
      }
    ),
    startingPosition: () => (
      {
        top: 400,
        left: 400,
        opacity: 0
      }
    )
  }
});

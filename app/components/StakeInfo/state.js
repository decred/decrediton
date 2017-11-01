import { provideState, update } from "freactal";

export default provideState({
  initialState: () => ({
    isShowingDetails: false,
  }),
  effects: {
    toggleDetails: update(state => ({ isShowingDetails: !state.isShowingDetails }))
  }
});

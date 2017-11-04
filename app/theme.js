import { get } from "fp";

const styles = {
  space: [],
  springs: {
    sideBar: { stiffness: 150, damping: 20 },
    tab:     { stiffness: 150, damping: 20 },
    page:    { stiffness: 150, damping: 15 },
    testing: { stiffness: 40,  damping: 26 },
  }
};

const getStyles = key => get(key, styles);

export default Object.assign(getStyles, styles);

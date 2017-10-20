import { createElement as h } from "react";
import { spring, TransitionMotion as TM } from "react-motion";
import { object, string, func, bool } from "prop-types";

const e = (s, o) => Object.keys(s).reduce((a, b) => { a[b] = typeof s[b] === "number" ? spring(s[b], o) : s[b]; return a; }, {});
const al = p => p.atLeave; const aa = p => p.atActive; const ae = p => p.atEnter;

const RT = p => {
  const base = { data: p.children, key: p.pathname };
  const defaultStyles =
    !p.runOnMount ? null :
    !p.children ? [] :
    [{...base, style: ae(p) }];

  const styles =
    !p.children ? [] :
    [{...base, style: e(aa(p), p.opts) }];

  const willEnter = () => ae(p);
  const willLeave = () => e(al(p), p.opts);
  const tm = { willEnter, willLeave, defaultStyles, styles };
  const route = ({ key, style, data }) => {
    const n = {...{key}, style: p.mapStyles(style) }; return h("div", n, data);
  };
  const routes = routes => h("div", null, routes.map(route));
  return h(TM, tm, routes);
};

RT.defaultProps = {
  runOnMount: true,
  mapStyles: val => val,
  opts: { stiffness: 40, damping: 26 }
};

RT.propTypes = {
  atEnter: object.isRequired,
  atActive: object.isRequired,
  atLeave: object.isRequired,
  pathname: string.isRequired,
  mapStyles: func,
  runOnMount: bool,
  opts: object
};

export default RT;

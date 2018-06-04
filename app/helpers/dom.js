import ownerDocument from "dom-helpers/ownerDocument";
import ReactDOM from "react-dom";

// isDescendant recursively checks whether the given `el` is a descendent of
// the given `target` DOM node.
export const isDescendant = (el, target) => {
  if (target !== null && target.parentNode) {
    return el === target || isDescendant(el, target.parentNode);
  }
  return false;
};

// eventOutsideElement returns true if the event that happened at the given
// `target` is outside the provided `el`. Eg: this is used to determine if
// the target of an onMouseUp event is outside a root element.
export const eventOutsideElement = (el, target) => {
  const doc = ownerDocument(el);
  return doc.documentElement &&
    doc.documentElement.contains(target) &&
    !isDescendant(el, target);
};

// eventOutsideComponent returns true if the event that happened at the given
// `target` is outside the provided `component`. Eg: this is used to determine
// if the target of an onMouseUp event is outside a root component.
export const eventOutsideComponent = (comp, target) => {
  const el = ReactDOM.findDOMNode(comp);
  return eventOutsideElement(el, target);
};

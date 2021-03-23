import React from "react";
import PropTypes from "prop-types";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

global.React = React;
global.PropTypes = PropTypes;

configure({ adapter: new Adapter() });

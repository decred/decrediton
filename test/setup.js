import autobind from "autobind-decorator";
import React from "react";
import PropTypes from "prop-types";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import EmptyHandler from "shared/EmptyHandler";

global.autobind = autobind;
global.React = React;
global.PropTypes = PropTypes;
global.Aux = EmptyHandler;

configure({ adapter: new Adapter() });

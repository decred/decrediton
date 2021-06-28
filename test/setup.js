import React from "react";
import PropTypes from "prop-types";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { webcrypto } from "crypto";

global.React = React;
global.PropTypes = PropTypes;
global.crypto = webcrypto;

configure({ adapter: new Adapter() });

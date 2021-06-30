import React from "react";
import PropTypes from "prop-types";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// TODO: Can be removed once we move past node v14.
import { Crypto } from "@peculiar/webcrypto";

global.React = React;
global.PropTypes = PropTypes;
global.crypto = new Crypto();

configure({ adapter: new Adapter() });

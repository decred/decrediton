import React from "react";
import Text from "./Text";

const Heading = props => (
  <Text is="h2" fontWeight="normal" f={ 27 } color="darkGrey" { ...props } />
);

export default Heading;

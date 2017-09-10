import React from "react";
import { Link } from "react-router";

const ErrorScreen = () => (
  <div>
    <p> Something went wrong, please go back </p>
    <Link to='/'>Back home</Link>
  </div>
);

export default ErrorScreen;

import React from "react";
import ErrorScreen from "../../ErrorScreen";
import HomePage from "./Page";
import service from "../../../connectors/service";

const Home = ({ walletService, ...props }) =>
  walletService
    ? <HomePage {...props} />
    : <ErrorScreen />;

export default service(Home);

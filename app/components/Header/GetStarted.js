// @flow
import React from "react";
import styles from "./styles";

const GetStarted = ({
  headerTop,
  headerTitleOverview,
  headerMetaOverview,
  children
}) => (
  <div style={styles.headerGetStarted}>
    <div style={styles.headerTopGetStarted}>{headerTop}</div>
    <div style={styles.headerTitleOverviewGetStarted}>{headerTitleOverview}</div>
    <div style={styles.headerMetaOverviewGetStarted}>{headerMetaOverview}</div>
    {children}
  </div>
);

export default GetStarted;

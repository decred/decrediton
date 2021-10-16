import { Documentation } from "shared";
import styles from "./DeviceSetupDocumentation.module.css";

const DeviceSetupDocumentation = ({ name }) => (
  <Documentation name={name} className={styles.documentation} />
);

export default DeviceSetupDocumentation;

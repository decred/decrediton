
import { settings } from "connectors";
export { default as SettingsHeader } from "./Header";

import SettingsForm from "./Form";
export const SettingsBody = settings(SettingsForm);

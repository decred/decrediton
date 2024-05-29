import { invocable } from "helpers/electronRenderer";

export const needsUdevRules = invocable("needs-udev-rules");
export const start = invocable("start-trezord");
export const stop = invocable("stop-trezord");

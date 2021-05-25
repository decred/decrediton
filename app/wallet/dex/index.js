import { invocable } from "helpers/electronRenderer";

export const start = invocable("start-dex");
export const stop = invocable("stop-dex");
export const checkInit = invocable("check-init-dex");
export const init = invocable("init-dex");
export const login = invocable("login-dex");
export const logout = invocable("logout-dex");
export const createWallet = invocable("create-wallet-dex");
export const user = invocable("user-dex");
export const getConfig = invocable("get-config-dex");
export const register = invocable("register-dex");
export const launchWindow = invocable("launch-dex-window");
export const checkBTCConfig = invocable("check-btc-config");
export const updateBTCConfig = invocable("update-btc-config");

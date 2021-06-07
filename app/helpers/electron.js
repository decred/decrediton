// Determine which electron context we're running in.
// The try{} is needed because in development, the main electron js
// file (main.development.js) does not go through webpack and thus the compile-
// time __ELECTRON_ENV var isn't defined.
export let electronEnv = "main";
try {
  // eslint-disable-next-line no-undef
  electronEnv = __ELECTRON_ENV;
} catch (error) {
  // Ignore. We're running in the main electron file in development mode.
}

export const inElectronPreload = electronEnv === "preload";
export const inElectronMain = electronEnv === "main";

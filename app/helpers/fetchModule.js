// This module is needed to allow selecting a different implementation for the
// fetch() function depending on the execution context of the code (electron
// main, preload or renderer process).
//
// The selection on whether to use this module or electron-fetch is made by the
// webpack config.
export default window.fetch;

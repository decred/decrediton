import { showConfirmationDialog, escape } from "./dialog";

export default (seed) =>
  showConfirmationDialog({
    title: {
      id: "confDialog.seed.title",
      m: "Create wallet with the following seed"
    },

    content: [
      seed instanceof Array
        ? [
            '<div class="seed">',
            seed.map((w) => ["<div>", escape(w), "</div>"]),
            "</div>"
          ]
        : ['<div class="hex-seed">', escape(seed), "</div>"]
    ]
  });

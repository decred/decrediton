import { showConfirmationDialog, escape } from "./dialog";

export default (host) =>
  showConfirmationDialog({
    title: {
      id: "confDialog.allowVSPHost.title",
      m: "Confirm Access to VSP Host"
    },

    content: [
      "<p>",
      {
        id: "confDialog.allowVSPHost.message",
        m: "Really allow network access to the following VSP host?"
      },
      "</p>",
      "<p><pre>",
      escape(host),
      "</pre></p>"
    ]
  });

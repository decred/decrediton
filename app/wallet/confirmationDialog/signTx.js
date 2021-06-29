import { showConfirmationDialog, escape } from "./dialog";

const outputRow = (output) => [
  "<li>",
  "<samp>",
  escape(output.address),
  ": </samp>&nbsp;",
  '<samp class="amount">',
  { atoms: output.amount },
  "</samp>",
  "</li>"
];

export default (totalOutAmount, outputs) =>
  showConfirmationDialog({
    title: {
      id: "confDialog.signTx.title",
      m: "Sign Transaction"
    },

    content: [
      "<p>",
      {
        id: "confDialog.signTransaction.message",
        m: "Really sign the given transaction?"
      },
      "</p>",

      "<p>",
      {
        id: "confDialog.signTransaction.totalOutLabel",
        m: "Total Spent Amount:"
      },
      '<samp class="amount"> ',
      { atoms: totalOutAmount },
      "</samp>",
      "</p>",

      "<p>",
      outputs.length > 0
        ? {
            id: "confDialog.signTransaction.outputs",
            m: "Non-wallet outputs:"
          }
        : "",
      "</p>",

      "<ul>",
      outputs.map(outputRow),
      "</ul>"
    ]
  });

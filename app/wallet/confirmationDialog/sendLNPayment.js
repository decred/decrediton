import { showConfirmationDialog, escape } from "./dialog";

export default (amount, hash, description, destination) =>
  showConfirmationDialog({
    title: {
      id: "confDialog.sendLNPayment.title",
      m: "Send LN Payment"
    },

    content: [
      "<p>",
      {
        id: "confDialog.sendLNPayment.message",
        m: "Attempt to send the following LN payment?"
      },
      "</p>",

      "<p>",
      {
        id: "confDialog.sendLNPayment.amountLabel",
        m: "Total Spent Amount:"
      },
      '&nbsp;<samp class="amount">',
      { atoms: amount },
      "</samp>",
      "</p>",

      "<p>",
      {
        id: "confDialog.sendLNPayment.description",
        m: "Description:"
      },
      "&nbsp;<samp>",
      escape(description),
      "</samp>",
      "</p>",

      "<p>",
      {
        id: "confDialog.sendLNPayment.destination",
        m: "Destination:"
      },
      '&nbsp;<samp class="word-break">',
      escape(destination),
      "</samp>",
      "</p>",

      "<p>",
      {
        id: "confDialog.sendLNPayment.paymentHash",
        m: "Hash:"
      },
      '&nbsp;<samp class="word-break">',
      escape(hash),
      "</samp>",
      "</p>"
    ]
  });

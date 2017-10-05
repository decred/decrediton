
// Add any new files to this array
const staticFilesData = [
  require("./menus.json")
];

// staticDefaults are the flattened messages for all statically-defined
// messages (all messages in this directory).
// This is needed for the static messages because they are not used with react-intl
// (they are used in places like the main menu).
const staticDefaults = staticFilesData.reduce((all, messages) => {
  messages.forEach(msg => {
    all[msg.id] = msg.defaultMessage;
  });
  return all;
}, {});

export default staticDefaults;

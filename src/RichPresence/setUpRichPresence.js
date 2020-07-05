const Log = require('../Utils/Log');

module.exports = function SetUpRichPresence(client) {
  client.user
    .setActivity('for idiots', {
      // name: '', //The message shown
      type: 'WATCHING',
    })
    .then(() => {
      Log(`Initialised rich presence`);
    })
    .catch(() => {
      Log(`Failed to initialise rich presence`, Log.SEVERITY.ERROR);
    });
};

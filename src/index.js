const Discord = require('discord.js');
const Config = require('./config');

const Log = require('./Utils/Log');

const CommandHandlers = require('./Commands');
const setUpRichPresence = require('./RichPresence/setUpRichPresence');

let totalErrorsThisSession = 0;

function newError() {
  totalErrorsThisSession += 1;
}

function errorCount() {
  return totalErrorsThisSession;
}

const client = new Discord.Client();

Log.init();

client.on('ready', () => {
  Log(`Logged in as ${client.user.tag}!`, Log.SEVERITY.SUCCESS);

  setUpRichPresence(client);
});

client.on('message', (msg) => {
  // It's me!
  if (msg.author.id === client.user.id) {
    return;
  }

  // It's one of me!
  if (msg.author.bot) {
    Log(
      `Ignoring message from bot in channel '#${msg.channel.name}' in server '${msg.guild.name}'`,
      Log.SEVERITY.VERBOSE
    );
    return;
  }

  // Iterate through command handlers until one is triggered
  CommandHandlers.every(async (handler) => {
    const result = await handler(msg, client);

    // break for loop if command gets handled
    if (result) return false;
    else return true;
  });
});

// Login!
client.login(Config.token);

module.exports.AddError = newError;
module.exports.GetErrorCount = errorCount;

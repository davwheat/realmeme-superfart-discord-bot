const moment = require('moment');
const fetch = require('node-fetch');

const Config = require('../config');
const Log = require('../Utils/Log');

const AllowedUsers = [Config.resources.userIds.mrjeeves, Config.resources.userIds.gamr13];

const { MessageEmbed } = require('discord.js');

module.exports = async function Diagnostics(message, client) {
  const { content } = message;

  if (content.startsWith(`${Config.commandPrefix}diagnostics`)) {
    const loadMsg = await message.channel.send(`${Config.resources.emojis.loading}  Just a mo' (⏱️ Initialising)`);

    // Unauthorised
    if (!AllowedUsers.includes(message.author.id)) {
      Log(
        `User ${message.author.username}#${message.author.discriminator} attempted to run diagnostics (${message.author.id})`,
        Log.SEVERITY.WARN
      );

      loadMsg.edit(`${Config.resources.emojis.fail}  You don't have permission to use this command`);
      return;
    }

    Log.Helpers.CommandRun(message, 'diagnostics');

    let beforeEdit = new Date();
    // Round trip ping
    await loadMsg.edit(
      `${Config.resources.emojis.loading}  Just a mo' (${Config.resources.emojis.ping} Calculating Discord API ping)`
    );
    let roundTripPing = loadMsg.createdAt - message.createdAt;

    // Discord API ping
    await loadMsg.edit(
      `${Config.resources.emojis.loading}  Just a mo' (${Config.resources.emojis.roundTripPing} Calculating ping to server)`
    );
    let apiPing = client.ws.ping;

    // Discord API status
    await loadMsg.edit(
      `${Config.resources.emojis.loading}  Just a mo' (${Config.resources.emojis.roundTripPing} Fetching Discord status)`
    );
    let discordStatusJson,
      discordStatusText = 'Unknown',
      discordStatusIcon = Config.resources.emojis.outageUnknown;
    try {
      discordStatusJson = await (await fetch('https://srhpyqt94yxb.statuspage.io/api/v2/status.json')).json();
      Log(discordStatusJson, Log.SEVERITY.VERBOSE);

      discordStatusText = discordStatusJson.status.description;

      switch (discordStatusJson.status.indicator) {
        case 'none':
          discordStatusIcon = Config.resources.emojis.outageNone;
          break;
        case 'minor':
          discordStatusIcon = Config.resources.emojis.outageMinor;
          break;
        case 'major':
          discordStatusIcon = Config.resources.emojis.outageMajor;
          break;
        case 'critical':
          discordStatusIcon = Config.resources.emojis.outageCritical;
          break;

        case 'unknown':
        default:
          discordStatusIcon = Config.resources.emojis.outageUnknown;
          break;
      }
    } catch (error) {
      Log(`Couldn't fetch Discord status: ` + error, Log.SEVERITY.WARN);
    }

    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle('Bot diagnostics')
      // Set the color of the embed
      .setColor(Config.colors.primary.hex)
      // Set the main content of the embed
      .setDescription("Oops, did something go wrong? Here's some diagnostic info.")
      .addField(
        'Uptime',
        `🕘 ${moment.duration(client.uptime).asHours().toFixed()}h ${moment
          .utc(client.uptime)
          .format('m')}m ${moment.utc(client.uptime).format('s')}s`,
        true
      )
      .addField('Round time ping', `${Config.resources.emojis.roundTripPing} ${roundTripPing}ms`, true)
      .addField('Discord API Ping', `${Config.resources.emojis.ping} ${apiPing}ms`, true)
      .addField('Discord status', `${discordStatusIcon}[${discordStatusText}](http://status.discordapp.com)`, true)
      .setFooter(`Calculated in ${new Date() - message.createdAt}ms`);

    // Send the embed to the same channel as the message
    await loadMsg.edit(embed);
    await loadMsg.edit(`${Config.resources.emojis.success} Done`);

    // handled
    return true;
  }

  // not handled
  return false;
};

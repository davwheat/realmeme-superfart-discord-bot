const Config = require('../config');
const { MessageEmbed } = require('discord.js');
const Log = require('../Utils/Log');

module.exports = async function SendGuideUrl(message) {
  const { content } = message;

  if (content.startsWith(`${Config.commandPrefix}guide`)) {
    Log.Helpers.CommandRun(message, 'guide');

    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle('realme X2 Pro unlocking and custom ROM guide')
      // Set the color of the embed
      .setColor(Config.colors.primary.hex)
      // Set the main content of the embed
      .setDescription(
        "New to custom ROMs? Check out the guide we've put together. It'll walk you through step-by-step."
      )
      .setURL(Config.resources.urls.guideUrl)
      .setFooter(`By Gamr13 and MrJeeves/davwheat`, '')
      .addField(
        'Get stuck?',
        `Just pop us a message in <#${Config.resources.channelIds.realme_x_series}> and we'll help you as best we can.`,
        false
      );

    if (message.mentions.members.length > 0) {
      let pings = '';

      Array.from(message.mentions.members.keys()).forEach((userId) => {
        pings += `<@${userId}> `;
      });

      await message.channel.send(`Hey ${pings}!`);
    }

    // Send the embed to the same channel as the message
    await message.channel.send(embed);

    // handled
    return true;
  }

  // not handled
  return false;
};

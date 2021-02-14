const Permissions = require('../../../data/Permissions');
module.exports.commandInfo = {
  trigger: 'viper',
  usage: 'viper [@mention(s)]',
  aliases: [],
  name: 'ViPER',
  description: 'Instructions for how to install ViPER4Android',
  permissionsNeeded: Permissions.User,
};

const Config = require('../../../Config');
const { MessageEmbed } = require('discord.js');
const Log = require('../../../Utils/Log');
const GetPings = require('../../../Utils/GetPings');
const DoesMessageMatchCommand = require('../../../Utils/DoesMessageMatchCommand');

module.exports.handler = async function ViperInstallation(message, client, data) {
  if (!DoesMessageMatchCommand(message, module.exports.commandInfo)) return false;

  const reply = await message.reply(`${Config.resources.emojis.loading.code} ${Config.resources.strings.loading}`);

  let viperInfo = null;
  try {
    viperInfo = require('../../../../files/ViPER/versions.json');
  } catch (err) {
    Log('Error fetching ViPER info', Log.SEVERITY.WARN);
    reply.edit(`${Config.resources.emojis.fail.code} An error ocurred. <@${Config.resources.userIds.mrjeeves}>`);
    return true;
  }

  const viperLatest = viperInfo.versions.latest;

  const embed = new MessageEmbed()
    // Set the title of the field
    .setTitle(`ViPER Audio FX ${viperLatest.versionNumber}`)
    // Set the color of the embed
    .setColor(Config.colors.primary)
    .setThumbnail(viperLatest.image)
    // Set the main content of the embed
    .setDescription(
      "**This does not work on realme UI.**\n\nThe audio on the X2 Pro is pretty terrible without using some audio effects app, and that's what ViPER is for."
    )
    .setURL(viperInfo.officialUrl)
    .addFields([
      {
        name: 'Installation',
        value:
          '**1.** Download the attached file and install it\n' +
          '**2.** Launch the app and grant superuser permission\n' +
          '**3.** Run the `adb` command below\n' +
          '**4.** Go into ViPER settings and toggle the two options at the top on and off again',
      },
      {
        name: 'Troubleshooting',
        value:
          'Because of how custom ROMs add their own FX apps, they can sometimes interfere with ViPER. Run the command below to uninstall these:\n' +
          '```adb shell "pm uninstall -k --user 0 com.android.musicfx; pm uninstall -k --user 0 com.dolby.dax2appUI; pm uninstall -k --user 0 com.motorola.dolby.dolbyui"```',
      },
      {
        name: 'Download',
        value: `[Download ViPER4Android ${viperLatest.versionNumber}](${viperLatest.downloadURL})`,
      },
    ])
    .setFooter(`${Config.resources.emojis.stopwatch.icon} Calculating...`);

  const pingText = GetPings(message);

  // Send the embed to the same channel as the message
  await reply.edit({
    content: `${Config.resources.emojis.success.code} Done! ${pingText}`,
    embed: embed,
  });

  setTimeout(async () => {
    embed.setFooter(
      `${Config.resources.emojis.stopwatch.icon} Message generated in ${reply.createdAt - message.createdAt}ms`
    );
    await reply.edit({ embed: embed });
  }, 250);

  // handled
  return true;
};

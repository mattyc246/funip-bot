const { SlashCommandBuilder } = require('discord.js');
const { getClanData } = require('../api/openSpots');

const MAX_MEMBERS = 30;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('open')
    .setDescription('Check the current number of open spots in each clan'),
  async execute(interaction) {
    const response = await getClanData();

    if (response?.isSuccess) {
      if (response?.data?.length === 0) {
        return await interaction.reply('No clan data found!');
      }

      let clanString = '';

      response?.data?.forEach((clan) => {
        const openSpaces = MAX_MEMBERS - clan?.attributes?.total_members;
        clanString += `**${clan?.attributes?.name}**: \n${
          clan?.attributes?.total_members
        }/${MAX_MEMBERS} Members \nStatus: ${
          clan?.attributes?.total_members === MAX_MEMBERS
            ? '**CLAN FULL**'
            : `**${openSpaces} OPEN SPACE${openSpaces === 1 ? '' : 'S'}**`
        }\n\n`;
      });

      await interaction.reply(clanString);
    } else {
      return await interaction.reply('BOT ERROR!');
    }
  }
};

const { default: axios } = require('axios');
const { SlashCommandBuilder } = require('discord.js');

const MAX_MEMBERS = 30;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('openspots')
    .setDescription('Check the current number of open spots in each clan'),
  async execute(interaction) {
    try {
      const { data } = await axios.get(process.env.GIST_DATA_ENDPOINT);

      const iynData = data.clans.iyn;
      const ohfuData = data.clans.ohfu;

      const iynOpen = MAX_MEMBERS - iynData.totalMembers;
      const ohfuOpen = MAX_MEMBERS - ohfuData.totalMembers;

      if (iynData.totalMembers)
        await interaction.reply(
          `**IYN**: \n${
            iynData.totalMembers
          }/${MAX_MEMBERS} Members \nStatus: ${
            iynData.totalMembers === MAX_MEMBERS
              ? '**CLAN FULL**'
              : `**${iynOpen} OPEN SPACE${iynOpen === 1 ? '' : 'S'}**`
          }\n\n**OHFU**: \n${ohfuData.totalMembers}/${MAX_MEMBERS} \nStatus: ${
            ohfuData.totalMembers === MAX_MEMBERS
              ? '**CLAN FULL**'
              : `**${ohfuOpen} OPEN SPACE${ohfuOpen === 1 ? '' : 'S'}**`
          }`
        );
    } catch (error) {
      console.log('ERROR: ', error);
      await interaction.reply('BOT ERROR!');
    }
  }
};

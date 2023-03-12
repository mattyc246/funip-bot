const { getCvcData } = require('../api/clanVsClan');
const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cvc')
    .setDescription('Check the upcoming CVC tournament details'),
  async execute(interaction) {
    const response = await getCvcData();

    if (response?.isSuccess) {
      if (response?.data?.length === 0) {
        return await interaction.reply(
          '**UPCOMING CVC**\n----------------\nCvC details not yet available'
        );
      }

      const nextCvc = response?.data[0];

      const startDate = moment(nextCvc?.attributes?.start_date).format(
        'Do MMMM YYYY'
      );
      const endDate = moment(nextCvc?.attributes?.end_date).format(
        'Do MMMM YYYY'
      );

      await interaction.reply(
        `**UPCOMING CVC**\n----------------\n**From:** ${startDate}\n**Until** ${endDate}\n----------------\nThis CvC **${
          nextCvc?.attributes?.personal_rewards ? 'WILL' : 'WILL NOT'
        }** feature Personal Rewards!${
          nextCvc?.attributes?.additional_notes
            ? `\n----------------\n${nextCvc?.attributes?.additional_notes}`
            : ''
        }`
      );
    } else {
      await interaction.reply('BOT ERROR!');
    }
  }
};

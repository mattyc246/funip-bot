const { SlashCommandBuilder } = require('discord.js');
const { get10xData } = require('../api/tenTimesSummons');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('10x')
    .setDescription('Check the next upcoming 10x event!'),
  async execute(interaction) {
    const response = await get10xData();

    if (response?.isSuccess) {
      if (response?.data?.length === 0) {
        return await interaction.reply(
          '**UPCOMING 10x EVENT**\n------------------\n Information not yet known'
        );
      }

      const nextEvent = response?.data[0];

      const startDate = moment(nextEvent?.attributes?.start_date).format(
        'Do MMMM YYYY'
      );
      const endDate = moment(nextEvent?.attributes?.end_date).format(
        'Do MMMM YYYY'
      );

      await interaction.reply(`
          **UPCOMING 10x EVENT**\n------------------\nCHAMPIONS:\n${
            nextEvent?.attributes?.champions
          }\n\n**From:** ${startDate} \n**Until:** ${endDate}${
        nextEvent?.attributes?.additional_notes
          ? `\n\n------------------\n**Additional Notes:**\n${nextEvent?.attributes?.additional_notes}`
          : ''
      }
        `);
    } else {
      return await interaction.reply(`BOT ERROR!`);
    }
  }
};

const { default: axios } = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cvc')
    .setDescription('Check the upcoming CVC tournament details'),
  async execute(interaction) {
    try {
      const { data } = await axios.get(process.env.GIST_DATA_ENDPOINT);

      if (!data.cvc.startDate || !data.cvc.endDate) {
        return await interaction.reply(
          '**UPCOMING CVC**\n----------------\nCvC details not yet available'
        );
      }

      const startDate = moment(data.cvc.startDate).format('Do MMMM YYYY');
      const endDate = moment(data.cvc.endDate).format('Do MMMM YYYY');

      await interaction.reply(
        `**UPCOMING CVC**\n----------------\n**From:** ${startDate}\n**Until** ${endDate}\n----------------\nThis CvC **${
          data.cvc.personalRewards ? 'WILL' : 'WILL NOT'
        }** feature Personal Rewards!`
      );
    } catch (error) {
      console.log('ERROR: ', error);
      await interaction.reply('BOT ERROR!');
    }
  }
};

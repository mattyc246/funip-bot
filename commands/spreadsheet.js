const { SlashCommandBuilder } = require('discord.js');
const { getSpreadsheetUrl } = require('../api/spreadsheet');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spreadsheet')
    .setDescription('Get the URL to the clan spreadsheet'),
  async execute(interaction) {
    const response = await getSpreadsheetUrl();

    if (response?.isSuccess) {
      await interaction.reply(`Click to view:\n${response?.data}`);
    } else {
      await interaction.reply('BOT ERROR!');
    }
  }
};

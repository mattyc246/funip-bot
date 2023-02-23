// Update spreadsheetUrl in GIST with the spreadsheet URL.

const { default: axios } = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spreadsheet')
    .setDescription('Get the URL to the clan spreadsheet'),
  async execute(interaction) {
    try {
      const { data } = await axios.get(process.env.GIST_DATA_ENDPOINT);
      await interaction.reply(`Click to view:\n${data.spreadsheetUrl}`);
    } catch (error) {
      console.log('ERROR: ', error);
      await interaction.reply('BOT ERROR!');
    }
  }
};

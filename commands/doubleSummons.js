const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('2x')
    .setDescription('Check the next upcoming 2x event!'),
  async execute(interaction) {
    await interaction.reply(`
      **UPCOMING 2x EVENT**\n---------------\nAncient shards from 24th February to 27th February\n\nExtra Harima 10x event running along side the 2x
    `);
  }
};

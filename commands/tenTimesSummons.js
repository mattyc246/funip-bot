const { default: axios } = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('10x')
    .setDescription('Check the next upcoming 10x event!'),
  async execute(interaction) {
    try {
      const { data } = await axios.get(process.env.GIST_DATA_ENDPOINT);

      const champions = data.tenTimes.champions;

      if (champions.length === 0) {
        await interaction.reply('UPCOMING 10x CHAMPIONS NOT YET KNOWN!');
        return;
      }

      const championsString = champions.map((champion) => `\n- ${champion}`);

      await interaction.reply(
        `*UPCOMING 10x EVENT*\n---------------\nChampions featured:${championsString.join(
          ''
        )}`
      );
    } catch (error) {
      console.log('ERROR: ', error);
      await interaction.reply('BOT ERROR!');
    }
  }
};

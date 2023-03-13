const { SlashCommandBuilder } = require('discord.js');
const { getSpreadsheetUrl } = require('../api/spreadsheet');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spreadsheet')
    .setDescription('Get the URL to the clan spreadsheet'),
  async execute(interaction) {
    const response = await getSpreadsheetUrl();

    if (response?.isSuccess) {
      const embedObject = {
        color: 0x37d44f,
        title: 'Karens Spreadsheet',
        description: 'Check out Karens nerdery!',
        fields: [
          {
            name: 'Clan Info',
            value: 'Information about the clans'
          },
          {
            name: 'Click to view',
            value: response?.data
          }
        ],
        thumbnail: {
          url: 'https://res.cloudinary.com/dejxmm6g7/image/upload/v1678602502/Ice_Fu_4d670431b7.png?updated_at=2023-03-12T06:28:43.411Z'
        }
      };

      await interaction.reply({ content: `Thanks nerd!`, ephemeral: true });
      return await interaction.channel.send({
        embeds: [embedObject]
      });
    } else {
      await interaction.reply('BOT ERROR!');
    }
  }
};

import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('spreadsheet')
  .setDescription('Get the URL to the clan spreadsheet');

export async function execute(interaction) {
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
        value:
          'https://docs.google.com/spreadsheets/d/1aBVkLPr9sfAo2v9JalhxyPu20ogdjUsPBEVEtvYNVDQ'
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
}

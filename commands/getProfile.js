import { SlashCommandBuilder } from 'discord.js';
import { getProfiles } from '../api/profile.js';

export const data = new SlashCommandBuilder()
  .setName('get_optimizer')
  .setDescription('Search for a users optimizer profile')
  .addStringOption((option) =>
    option
      .setName('user')
      .setDescription('Search by discord on in game name')
      .setRequired(true)
  );

export async function execute(interaction) {
  try {
    const searchName = interaction.options.getString('user');

    await interaction.deferReply({ ephemeral: true });

    const response = await getProfiles();

    if (response?.isSuccess) {
      if (response?.links?.length === 0) {
        return await interaction.editReply('No links to search at this time.');
      }

      const filteredLinks = response?.links?.filter((link) => {
        return (
          link?.discordName
            ?.toLowerCase()
            ?.includes(searchName?.toLowerCase()) ||
          link?.raidName?.toLowerCase()?.includes(searchName?.toLowerCase())
        );
      });

      if (filteredLinks?.length === 0) {
        return await interaction.editReply(
          'No users found matching this username, please try again!'
        );
      }

      await interaction.editReply(`${filteredLinks?.length} users found!`);

      const embeds = [];

      filteredLinks?.forEach((link) => {
        const embedObject = {
          color: 0xfcba03,
          title: `Optimizer Link`,
          description: 'Hell Hades Optimizer Shareable Link',
          url: link?.link,
          fields: [
            {
              name: `Discord Name`,
              value: link?.discordName,
              inline: true
            },
            {
              name: `In Game Name`,
              value: link?.raidName,
              inline: true
            },
            {
              name: `Click to view`,
              value: link?.link
            }
          ]
        };
        embeds.push(embedObject);
      });

      return await interaction.channel.send({
        embeds
      });
    } else {
      return await interaction.editReply(
        'Failed to fetch optimizer links, please try again!'
      );
    }
  } catch (err) {
    console.log(err);
    return await interaction.editReply('BOT ERROR!');
  }
}

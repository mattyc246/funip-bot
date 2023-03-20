const { SlashCommandBuilder } = require('discord.js');
const { getProfiles } = require('../api/profile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get_optimizer')
    .setDescription('Search for a users optimizer profile')
    .addStringOption((option) =>
      option
        .setName('user')
        .setDescription('Search by discord on in game name')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const searchName = interaction.options.getString('user');

      await interaction.deferReply({ ephemeral: true });

      const response = await getProfiles();

      if (response?.isSuccess) {
        if (response?.profiles?.length === 0) {
          return await interaction.editReply(
            'No links to search at this time.'
          );
        }

        const filteredProfiles = response?.profiles?.filter((profile) => {
          return (
            profile?.attributes?.discord_name
              ?.toLowerCase()
              ?.includes(searchName?.toLowerCase()) ||
            profile?.attributes?.raid_name
              ?.toLowerCase()
              ?.includes(searchName?.toLowerCase())
          );
        });

        if (filteredProfiles?.length === 0) {
          return await interaction.editReply(
            'No users found matching this username, please try again!'
          );
        }

        await interaction.editReply(`${filteredProfiles?.length} users found!`);

        const embeds = [];

        filteredProfiles?.forEach((profile) => {
          const embedObject = {
            color: 0xfcba03,
            title: `Optimizer Link`,
            description: 'Hell Hades Optimizer Shareable Link',
            url: profile?.attributes?.link,
            fields: [
              {
                name: `Discord Name`,
                value: profile?.attributes?.discord_name,
                inline: true
              },
              {
                name: `In Game Name`,
                value: profile?.attributes?.raid_name,
                inline: true
              },
              {
                name: `Click to view`,
                value: profile?.attributes?.link
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
};

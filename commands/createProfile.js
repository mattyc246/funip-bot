import { SlashCommandBuilder } from 'discord.js';
import { createProfile } from '../api/profile.js';

export const data = new SlashCommandBuilder()
  .setName('add_optimizer')
  .setDescription('Create your optimizer profile')
  .addStringOption((option) =>
    option
      .setName('link')
      .setDescription('Add HH optimizer link')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('in_game_name')
      .setDescription('Add your in game name')
      .setRequired(true)
  );

export async function execute(interaction) {
  try {
    const link = interaction.options.getString('link');
    const gameName = interaction.options.getString('in_game_name');
    const discordId = interaction.user.id;
    const discordName = interaction.user.username;

    const data = {
      data: {
        discord_name: discordName,
        raid_name: gameName,
        link,
        discord_id: discordId
      }
    };

    await interaction.deferReply({ ephemeral: true });

    const response = await createProfile(data);

    if (response?.isSuccess) {
      await interaction.editReply('Successfully created');

      const embedObject = {
        color: 0xfcba03,
        title: `Optimizer Link`,
        description: 'Hell Hades Optimizer Shareable Link',
        url: link,
        fields: [
          {
            name: `Discord Name`,
            value: discordName,
            inline: true
          },
          {
            name: `In Game Name`,
            value: gameName,
            inline: true
          },
          {
            name: `Click to view`,
            value: link
          }
        ]
      };
      return await interaction.channel.send({
        embeds: [embedObject]
      });
    }

    if (!response?.isSuccess && response?.error === 'ValidationError') {
      return await interaction.editReply(
        'Profile exists for this discord user, please contact admin to reset'
      );
    }

    return await interaction.editReply(
      'Unknown error occured while trying to create optimizer profile'
    );
  } catch (err) {
    return await interaction.editReply('BOT ERROR!');
  }
}

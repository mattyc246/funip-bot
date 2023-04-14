import { SlashCommandBuilder } from 'discord.js';
import { getClanData } from '../api/openSpots.js';

const MAX_MEMBERS = 30;

export const data = new SlashCommandBuilder()
  .setName('open')
  .setDescription('Check the current number of open spots in each clan');

export async function execute(interaction) {
  const response = await getClanData();

  if (response?.isSuccess) {
    if (response?.data?.length === 0) {
      return await interaction.reply('No clan data found!');
    }

    const embeds = response?.data?.map((clan) => {
      const isClanFull = clan?.attributes?.total_members === MAX_MEMBERS;

      return {
        title: clan?.attributes?.name,
        color: isClanFull ? 0xe61c47 : 0x32a852,
        fields: [
          {
            name: 'Members',
            value: `${clan?.attributes?.total_members} / ${MAX_MEMBERS}`,
            inline: true
          },
          {
            name: 'Status',
            value: isClanFull ? 'FULL' : 'AVAILABLE'
          }
        ]
      };
    });

    await interaction.reply({ content: 'Thanks nerd!', ephemeral: true });
    return await interaction.channel.send({
      embeds: embeds
    });
  } else {
    return await interaction.reply('BOT ERROR!');
  }
}

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getFusionData } from '../api/fusion.js';
import moment from 'moment';

const getAffinityColor = (affinity) => {
  switch (affinity) {
    case 'Void':
      return 0xcb3dc9;
    case 'Spirit':
      return 0x52c548;
    case 'Force':
      return 0xe54b3c;
    case 'Magic':
      return 0x59c0f9;
    default:
      return 0x000000;
  }
};

export const data = new SlashCommandBuilder()
  .setName('fusion')
  .setDescription('Shows the current fusion details and fusion planner');

export async function execute(interaction) {
  const response = await getFusionData();

  if (response?.isSuccess) {
    if (response?.data?.length === 0) {
      return await interaction.reply('No current upcoming fusions.');
    }

    const activeFusion = response?.data[0]?.attributes;

    const imageUrl = activeFusion?.fusion_planner?.data?.attributes?.url;

    const startDate = moment(activeFusion?.start_date).format('Do MMMM YYYY');
    const endDate = moment(activeFusion?.end_date).format('Do MMMM YYYY');

    const embedObject = {
      color: getAffinityColor(activeFusion?.affinity),
      title: activeFusion?.champion_name,
      description: 'Current Raid Shadow Legends Champion Fusion',
      fields: [
        {
          name: `Start Date`,
          value: startDate,
          inline: true
        },
        {
          name: `End Date`,
          value: endDate,
          inline: true
        },
        {
          name: `Fusion Type`,
          value: activeFusion?.fusion_type
        },
        {
          name: 'Faction',
          value: activeFusion?.faction,
          inline: true
        },
        {
          name: `Affinity`,
          value: activeFusion?.affinity,
          inline: true
        }
      ],
      image: {
        url: imageUrl
      }
    };

    const message = 'Thanks nerd!';

    await interaction.reply({ content: message, ephemeral: true });
    return await interaction.channel.send({
      embeds: [embedObject]
    });
  } else {
    return await interaction.reply('BOT ERROR!');
  }
}

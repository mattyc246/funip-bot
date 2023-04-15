import { SlashCommandBuilder } from 'discord.js';
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

const getFusionType = (type) => {
  switch (type) {
    case 'fragment':
      return 'Fragment Collector';
    case 'fragment_fusion':
      return 'Fragment Fusion';
    default:
      return 'Classic';
  }
};

export const data = new SlashCommandBuilder()
  .setName('fusion')
  .setDescription('Shows the current fusion details and fusion planner');

export async function execute(interaction) {
  const response = await getFusionData();

  if (response?.isSuccess) {
    if (response?.fusions?.length === 0) {
      return await interaction.reply('No current upcoming fusions.');
    }

    const activeFusion = response?.fusions[0];

    const imageUrl = activeFusion?.fusionPlanner;

    const startDate = moment(activeFusion?.startDate?.toDate()).format(
      'Do MMMM YYYY'
    );
    const endDate = moment(activeFusion?.endDate?.toDate()).format(
      'Do MMMM YYYY'
    );

    const embedObject = {
      color: getAffinityColor(activeFusion?.affinity),
      title: activeFusion?.championName,
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
          value: getFusionType(activeFusion?.fusionType)
        },
        {
          name: 'Faction',
          value: activeFusion?.faction,
          inline: true
        },
        {
          name: `Affinity`,
          value:
            activeFusion?.affinity?.charAt(0).toUpperCase() +
            activeFusion?.affinity?.slice(1),
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

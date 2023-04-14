import { SlashCommandBuilder, formatEmoji } from 'discord.js';
import moment from 'moment';
import { get2xData } from '../api/doubleSummons.js';

const getEmojiId = (type) => {
  switch (type) {
    case 'ancient':
      return '1078894401838907442';
    case 'void':
      return '1078894411066388532';
    case 'sacred':
      return '1078894406893043762';
  }
};

export const data = new SlashCommandBuilder()
  .setName('2x')
  .setDescription('Check the next upcoming 2x event!');

export async function execute(interaction) {
  const response = await get2xData();

  if (response?.isSuccess) {
    if (response?.data?.length === 0) {
      return await interaction.reply(
        '**UPCOMING 2x EVENT**\n------------------\n Information not yet known'
      );
    }

    const nextEvent = response?.data[0];

    const shard = formatEmoji(getEmojiId(nextEvent?.attributes?.shard_type));

    const startDate = moment(nextEvent?.attributes?.start_date).format(
      'Do MMMM YYYY'
    );
    const endDate = moment(nextEvent?.attributes?.end_date).format(
      'Do MMMM YYYY'
    );

    await interaction.reply(`
        **UPCOMING 2x EVENT**\n------------------\n${shard} **${nextEvent?.attributes?.shard_type?.toUpperCase()} SHARDS** ${shard}\n\n**From:** ${startDate} \n**Until:** ${endDate}${
      nextEvent?.attributes?.additional_notes
        ? `\n\n------------------\n**Additional Notes:**\n${nextEvent?.attributes?.additional_notes}`
        : ''
    }
      `);
  } else {
    return await interaction.reply(`BOT ERROR!`);
  }
}

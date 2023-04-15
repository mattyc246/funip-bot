import { SlashCommandBuilder } from 'discord.js';
import { get10xData } from '../api/tenTimesSummons.js';
import moment from 'moment';

export const data = new SlashCommandBuilder()
  .setName('10x')
  .setDescription('Check the next upcoming 10x event!');

export async function execute(interaction) {
  const response = await get10xData();

  if (response?.isSuccess) {
    if (response?.events?.length === 0) {
      return await interaction.reply(
        '**UPCOMING 10x EVENT**\n------------------\n Information not yet known'
      );
    }

    const nextEvent = response?.events[0];

    const startDate = moment(nextEvent?.startDate?.toDate()).format(
      'Do MMMM YYYY'
    );
    const endDate = moment(nextEvent?.endDate?.toDate()).format('Do MMMM YYYY');

    await interaction.reply(`
          **UPCOMING 10x EVENT**\n------------------\nCHAMPIONS:\n${
            nextEvent?.champions
          }\n\n**From:** ${startDate} \n**Until:** ${endDate}${
      nextEvent?.additionalNotes
        ? `\n\n------------------\n**Additional Notes:**\n${nextEvent?.additionalNotes}`
        : ''
    }
        `);
  } else {
    return await interaction.reply(`BOT ERROR!`);
  }
}

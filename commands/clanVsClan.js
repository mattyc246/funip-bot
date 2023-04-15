import { getCvcData } from '../api/clanVsClan.js';
import { SlashCommandBuilder } from 'discord.js';
import moment from 'moment';

export const data = new SlashCommandBuilder()
  .setName('cvc')
  .setDescription('Check the upcoming CVC tournament details');

export async function execute(interaction) {
  const response = await getCvcData();

  if (response?.isSuccess) {
    if (response?.cvcs?.length === 0) {
      return await interaction.reply(
        '**UPCOMING CVC**\n----------------\nCvC details not yet available'
      );
    }

    const nextCvc = response?.cvcs[0];

    const startDate = moment(nextCvc?.startDate?.toDate()).format(
      'Do MMMM YYYY'
    );
    const endDate = moment(nextCvc?.endDate?.toDate()).format('Do MMMM YYYY');

    await interaction.reply(
      `**UPCOMING CVC**\n----------------\n**From:** ${startDate}\n**Until** ${endDate}\n----------------\nThis CvC **${
        nextCvc?.personalRewards ? 'WILL' : 'WILL NOT'
      }** feature Personal Rewards!${
        nextCvc?.additionalNotes
          ? `\n----------------\n${nextCvc?.additionalNotes}`
          : ''
      }`
    );
  } else {
    await interaction.reply('BOT ERROR!');
  }
}

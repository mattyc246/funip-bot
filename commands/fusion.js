const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getFusionData } = require('../api/fusion');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fusion')
    .setDescription('Shows the current fusion details and fusion planner'),
  async execute(interaction) {
    const response = await getFusionData();

    if (response?.isSuccess) {
      if (response?.data?.length === 0) {
        return await interaction.reply('No current upcoming fusions.');
      }

      const activeFusion = response?.data[0]?.attributes;

      const imageUrl = activeFusion?.fusion_planner?.data?.attributes?.url;

      const startDate = moment(activeFusion?.start_date).format('Do MMMM YYYY');
      const endDate = moment(activeFusion?.end_date).format('Do MMMM YYYY');

      const embed = new EmbedBuilder().setImage(imageUrl);

      const message = `**FUSION DETAILS**\n----------------\n**Champion:** ${activeFusion?.champion_name}\n**Affinity:** ${activeFusion?.affinity}\n**Fusion Type:** ${activeFusion?.fusion_type}\n**From:** ${startDate}\n**Until:** ${endDate}`;

      await interaction.reply(message);
      return await interaction.channel.send({
        embeds: [embed]
      });
    } else {
      return await interaction.reply('BOT ERROR!');
    }
  }
};

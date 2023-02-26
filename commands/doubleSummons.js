const { default: axios } = require('axios');
const { SlashCommandBuilder, formatEmoji } = require('discord.js');
const moment = require('moment');

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

module.exports = {
  data: new SlashCommandBuilder()
    .setName('2x')
    .setDescription('Check the next upcoming 2x event!'),
  async execute(interaction) {
    try {
      const { data } = await axios.get(process.env.GIST_DATA_ENDPOINT);
      const shard = formatEmoji(getEmojiId(data.twoTimes.shardType));

      if (!data.twoTimes.startDate || !data.twoTimes.endDate) {
        return await interaction.reply(
          '**UPCOMING 2x EVENT**\n------------------\n Information not yet known'
        );
      }

      const startDate = moment(data.twoTimes.startDate).format('Do MMMM YYYY');
      const endDate = moment(data.twoTimes.endDate).format('Do MMMM YYYY');

      let additionalNotesString;

      if (data.twoTimes.additionalNotes.length > 0) {
        additionalNotesString = data.twoTimes.additionalNotes
          .map((note) => `- ${note}\n`)
          .join('');
      }

      await interaction.reply(`
        **UPCOMING 2x EVENT**\n------------------\n${shard} **${data.twoTimes.shardType.toUpperCase()} SHARDS** ${shard}\n\n**From:** ${startDate} \n**Until:** ${endDate}${
        additionalNotesString
          ? `\n\n------------------\n**Additional Notes:**\n${additionalNotesString}`
          : ''
      }
      `);
    } catch (error) {
      console.log(error);
      return await interaction.reply(`BOT ERROR!`);
    }
  }
};

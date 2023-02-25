const { SlashCommandBuilder, formatEmoji } = require('discord.js');

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
    const shard = formatEmoji(getEmojiId('ancient'));

    await interaction.reply(`
      **UPCOMING 2x EVENT**\n------------------\n${shard} Ancient shards from 24th February to 27th February\n\nExtra Harima 10x event running along side the 2x
    `);
  }
};

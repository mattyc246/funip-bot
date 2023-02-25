const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ehp')
    .setDescription('Calculate the effective HP from HP and DEF')
    .addStringOption((option) =>
      option.setName('hp').setDescription('Champions HP').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('def').setDescription('Champions DEF').setRequired(true)
    ),
  async execute(interaction) {
    const defense = interaction.options.getString('def');
    const hp = interaction.options.getString('hp');

    let parsedDef;
    let parsedHp;

    try {
      parsedDef = parseInt(defense);
      parsedHp = parseInt(hp);

      if (isNaN(parsedDef) || isNaN(parsedHp)) {
        throw new Error('Provided values are not a number!');
      }
    } catch (error) {
      return await interaction.reply(error.message);
    }

    const calculatedEHP = Math.floor(
      parsedHp / (1 - 0.85 * (1 - Math.E ** ((-2 * parsedDef) / 3000)))
    );

    await interaction.reply(
      `**CALCULATED EHP**\n---------------------\nYour effective HP is:\n**${calculatedEHP}**`
    );
  }
};

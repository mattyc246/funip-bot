import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('debuff')
  .setDescription('Calculate % chance to land debuff from ACC & RES')
  .addStringOption((option) =>
    option.setName('acc').setDescription('Champions ACC').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('res').setDescription('Enemy RES').setRequired(true)
  );

export async function execute(interaction) {
  const accuracy = interaction.options.getString('acc');
  const resistance = interaction.options.getString('res');

  let parsedAcc;
  let parsedRes;

  try {
    parsedAcc = parseInt(accuracy);
    parsedRes = parseInt(resistance);

    if (isNaN(parsedAcc) || isNaN(parsedRes)) {
      throw new Error('Provided values are not a number!');
    }
  } catch (error) {
    return await interaction.reply(error.message);
  }

  const baseline = parsedAcc - parsedRes;

  let debuffChance;

  if (baseline > -30) {
    debuffChance = (
      (1 -
        (0.03 + 0.27 * Math.E ** (6 * ((parsedRes - parsedAcc) / 100) - 0.3))) *
      100
    ).toFixed(2);
  } else {
    debuffChance = (
      (1 -
        (0.3 +
          0.67 * (1 - Math.E ** (3 * (0.3 - (parsedRes - parsedAcc) / 100))))) *
      100
    ).toFixed(2);
  }

  await interaction.reply({
    content: `**CALCULATED DEBUFF CHANCE**\n---------------------\n**Champion Accuracy:** ${parsedAcc}\n**Enemy Resistance:** ${parsedRes}\nYour chance to land the debuff is:\n**${debuffChance}%**`,
    ephemeral: true
  });
}

import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('speed_calculator')
  .setDescription('Calculate actual champion speed')
  .addStringOption((option) =>
    option
      .setName('base')
      .setDescription('Champions base speed')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('actual')
      .setDescription('Champions actual build speed')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('aura')
      .setDescription('Aura speed bonus (%)')
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName('blessing')
      .setDescription('Blessing bonus speed (%)')
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName('rival_blessing')
      .setDescription('Rival blessing deduction (%)')
      .setRequired(false)
  );

export async function execute(interaction) {
  const baseSpeed = interaction.options.getString('base');
  const actualSpeed = interaction.options.getString('actual');
  const auraSpeed = interaction.options.getString('aura');
  const blessingSpeed = interaction.options.getString('blessing');
  const rivalBlessingSpeed = interaction.options.getString('rival_blessing');

  let parsedBaseSpeed;
  let parsedActualSpeed;
  let parsedAuraSpeed;
  let parsedBlessingSpeed;
  let parsedRivalBlessingSpeed;

  try {
    parsedBaseSpeed = parseInt(baseSpeed);
    parsedActualSpeed = parseInt(actualSpeed);
    parsedAuraSpeed = parseInt(auraSpeed) || 0;
    parsedBlessingSpeed = parseInt(blessingSpeed) || 0;
    parsedRivalBlessingSpeed = parseInt(rivalBlessingSpeed) || 0;

    if (
      isNaN(parsedBaseSpeed) ||
      isNaN(parsedActualSpeed) ||
      isNaN(parsedAuraSpeed) ||
      isNaN(parsedBlessingSpeed) ||
      isNaN(parsedRivalBlessingSpeed)
    ) {
      throw new Error('One of more values are not a value number!');
    }
  } catch (error) {
    return await interaction.reply(error.message);
  }

  let trueSpeed = parsedActualSpeed;

  if (parsedAuraSpeed) {
    console.log('parsedAuraSpeed', parsedAuraSpeed);
    if (parsedBlessingSpeed) {
      parsedAuraSpeed += parsedAuraSpeed * (parsedBlessingSpeed / 100);
    }
    if (parsedRivalBlessingSpeed) {
      parsedAuraSpeed -= parsedAuraSpeed * (parsedRivalBlessingSpeed / 100);
    }
    trueSpeed += parsedBaseSpeed * (parsedAuraSpeed / 100);
  }

  await interaction.reply({
    content: `**CALCULATED SPEED**\n---------------------\n**Champion Base Speed:** ${parsedBaseSpeed}\n**Champion Actual Speed:** ${parsedActualSpeed}\n**Aura Speed Bonus:** ${parsedAuraSpeed}%\n**Blessing Bonus Speed:** ${parsedBlessingSpeed}%\n**Rival Blessing Deduction:** ${parsedRivalBlessingSpeed}%\n\nYour true speed is:\n**${trueSpeed}**`,
    ephemeral: true
  });
}

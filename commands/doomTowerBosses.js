import axios from 'axios';
import { SlashCommandBuilder } from 'discord.js';
import { uploadImageFile } from '../api/imageUploader.js';
import { bosses } from '../data/doomTowerBossData.js';

const CHANNEL_ID = '1112500788342821005';

export const data = new SlashCommandBuilder()
  .setName('dt_boss')
  .setDescription('Upload your best DT Boss teams')
  .addAttachmentOption((option) =>
    option
      .setName('image')
      .setDescription('Screenshot of your best DT boss run')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('boss')
      .setDescription('Select the boss')
      .addChoices(
        { name: 'Frost Spider', value: '1' },
        { name: 'Eternal Dragon', value: '2' },
        { name: 'Nether Spider', value: '3' },
        { name: 'Scarab King', value: '4' },
        { name: 'Bommal the Dreadhorn', value: '5' },
        { name: 'Dark Fae', value: '6' },
        { name: 'Magma Dragon', value: '7' },
        { name: 'Celestial Griffin', value: '8' }
      )
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('details').setDescription('Add details about your team comp')
  );

export async function execute(interaction, client) {
  const image = interaction.options.getAttachment('image');
  const bossId = interaction.options.getString('boss');
  const details = interaction.options.getString('details');

  if (!image) {
    return await interaction.reply({
      content: 'No image provided, please provide an image to upload.',
      ephemeral: true
    });
  }

  if (!image.contentType.includes('image')) {
    return await interaction.reply({
      content: 'Attachment must be an image!',
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    const webhooks = await channel.fetchWebhooks();
    const webhook = webhooks.first();

    const imageName = `${new Date().getTime()}_${image.name}`;

    const imageRes = await axios.get(image.url, {
      responseType: 'arraybuffer'
    });

    const dataUrl = `data:${image.contentType};base64,${Buffer.from(
      imageRes.data,
      'binary'
    ).toString('base64')}`;

    const uploadRes = await uploadImageFile(dataUrl, imageName);

    const boss = bosses.find((b) => b.id === Number(bossId));

    const embedObject = {
      color: boss.color,
      title: `${boss.bossName}!`,
      description: 'Best Run!',
      fields: [
        {
          name: `User`,
          value: interaction?.user?.username,
          inline: true
        },
        {
          name: `Boss`,
          value: boss.bossName,
          inline: true
        }
      ],
      image: {
        url: uploadRes?.data
      }
    };

    if (details) {
      embedObject.fields.push({
        name: 'Details',
        value: details
      });
    }

    await webhook.send({
      threadId: boss.threadId,
      embeds: [embedObject]
    });

    return await interaction.editReply('Received!');
  } catch (error) {
    console.log('Error: ', error);
    return await interaction.editReply('BOT ERROR!');
  }
}

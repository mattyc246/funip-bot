import axios from 'axios';
import { SlashCommandBuilder } from 'discord.js';
import { uploadImageFile } from '../api/imageUploader.js';
import { factions } from '../data/factionWarsData.js';

const CHANNEL_ID = '1110562644211011594';

export const data = new SlashCommandBuilder()
  .setName('faction_wars')
  .setDescription('Upload your best Faction Wars Stage 21 team')
  .addAttachmentOption((option) =>
    option
      .setName('image')
      .setDescription('Screenshot of your best Faction Wars Stage 21 run')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('faction')
      .setDescription('Select the faction')
      .addChoices(
        { name: 'Banner Lords', value: '1' },
        { name: 'High Elves', value: '2' },
        { name: 'Sacred Order', value: '3' },
        { name: 'Barbarians', value: '4' },
        { name: 'Ogryn Tribes', value: '5' },
        { name: 'Lizardmen', value: '6' },
        { name: 'Skinwalkers', value: '7' },
        { name: 'Orcs', value: '8' },
        { name: 'Demonspawn', value: '9' },
        { name: 'Undead Hordes', value: '10' },
        { name: 'Dark Elves', value: '11' },
        { name: 'Knight Revenant', value: '12' },
        { name: 'Dwarves', value: '13' },
        { name: 'Shadowkin', value: '14' },
        { name: 'Sylvan Watchers', value: '15' }
      )
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('details').setDescription('Add details about your team comp')
  );

export async function execute(interaction, client) {
  const image = interaction.options.getAttachment('image');
  const factionId = interaction.options.getString('faction');
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

    const faction = factions.find((f) => f.id === Number(factionId));

    const embedObject = {
      color: faction.color,
      title: `${faction.factionName} crypt!`,
      description: 'Stage 21 Run!',
      fields: [
        {
          name: `User`,
          value: interaction?.user?.username,
          inline: true
        },
        {
          name: `Faction`,
          value: faction.factionName,
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
      threadId: faction.threadId,
      embeds: [embedObject]
    });

    return await interaction.editReply('Received!');
  } catch (error) {
    console.log('Error: ', error);
    return await interaction.editReply('BOT ERROR!');
  }
}

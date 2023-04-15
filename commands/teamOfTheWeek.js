import axios from 'axios';
import { SlashCommandBuilder } from 'discord.js';
import { createTotwEntry } from '../api/teamOfTheWeek.js';
import { uploadImageFile } from '../api/imageUploader.js';

export const data = new SlashCommandBuilder()
  .setName('totw')
  .setDescription('Upload your team of the week')
  .addAttachmentOption((option) =>
    option
      .setName('image')
      .setDescription('Screenshot of your dungeon/boss run')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('dungeon')
      .setDescription('Select the dungeon')
      .addChoices(
        { name: 'Demon Lord', value: 'Demon Lord' },
        { name: 'Hydra', value: 'Hydra' },
        { name: 'Iron Twins', value: 'Iron Twins' },
        { name: 'Sand Devils Necropolis', value: 'Sand Devils Necropolis' },
        { name: 'Spider', value: 'Spider' },
        { name: 'Dragon', value: 'Dragon' },
        { name: 'Fire Knight', value: 'Fire Knight' },
        { name: 'Ice Golem', value: 'Ice Golem' }
      )
      .setRequired(true)
  );

export async function execute(interaction) {
  const image = interaction.options.getAttachment('image');
  const dungeon = interaction.options.getString('dungeon');

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
    const imageRes = await axios.get(image.url, {
      responseType: 'arraybuffer'
    });

    const dataUrl = `data:${image.contentType};base64,${Buffer.from(
      imageRes.data,
      'binary'
    ).toString('base64')}`;

    const uploadRes = await uploadImageFile(dataUrl, image.name);

    const data = {
      dungeon,
      screenshot: uploadRes?.data,
      submittedBy: interaction?.user?.username
    };

    const res = await createTotwEntry(data);

    if (res?.isSuccess) {
      await interaction.editReply('Successfully submitted for TOTW!');
      const embedObject = {
        color: 0xfcba03,
        title: 'TOTW Submission',
        description: 'Submission accepted to TOTW!',
        fields: [
          {
            name: `User`,
            value: interaction?.user?.username,
            inline: true
          },
          {
            name: `Dungeon`,
            value: dungeon,
            inline: true
          }
        ],
        image: {
          url: uploadRes?.data
        }
      };
      return await interaction.channel.send({
        embeds: [embedObject]
      });
    } else {
      return await interaction.editReply(
        'Submission was not received, please try again!'
      );
    }
  } catch (error) {
    console.log('Error: ', error);
    return await interaction.editReply('BOT ERROR!');
  }
}

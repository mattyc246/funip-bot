const { default: axios } = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { createTotwEntry, uploadImage } = require('../api/teamOfTheWeek');

function b64toBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/jpeg' });
}

function dungeonChoiceToString(choice) {
  const choices = {
    demon_lord: 'Demon Lord',
    hydra: 'Hydra',
    iron_twins: 'Iron Twins',
    sand_devils_necrolopolis: 'Sand Devils Necropolis',
    spider: 'Spider',
    dragon: 'Dragon',
    fire_knight: 'Fire Knight',
    ice_golem: 'Ice Golem'
  };
  return choices[choice] ?? '';
}

module.exports = {
  data: new SlashCommandBuilder()
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
          { name: 'Demon Lord', value: 'demon_lord' },
          { name: 'Hydra', value: 'Hydra' },
          { name: 'Iron Twins', value: 'iron_twins' },
          { name: 'Sand Devils Necropolis', value: 'sand_devils_necropolis' },
          { name: 'Spider', value: 'spider' },
          { name: 'Dragon', value: 'dragon' },
          { name: 'Fire Knight', value: 'fire_knight' },
          { name: 'Ice Golem', value: 'ice_golem' }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
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

      const blob = b64toBlob(dataUrl);

      const formData = new FormData();
      formData.append('files', blob, image.name);

      const uploadRes = await uploadImage(formData);

      const data = {
        data: {
          dungeon,
          screenshot: uploadRes?.image?.id,
          user: interaction?.user?.username
        }
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
              value: dungeonChoiceToString(dungeon),
              inline: true
            }
          ],
          image: {
            url: uploadRes?.image?.url
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
};

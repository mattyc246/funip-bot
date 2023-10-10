import { Events, codeBlock } from 'discord.js';

const LOG_CHANNEL_ID = '1123908665930428446';

export default {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const channel = await interaction.client.channels.fetch(LOG_CHANNEL_ID);
    const webhooks = await channel.fetchWebhooks();
    const webhook = webhooks.first();

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction, interaction.client);
      webhook.send({
        embeds: [
          {
            color: 0x42f578,
            title: 'Command Log',
            fields: [
              {
                name: `Time`,
                value: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
                inline: true
              },
              {
                name: `User`,
                value: interaction?.user?.username,
                inline: true
              },
              {
                name: `Command`,
                value: interaction.commandName,
                inline: true
              }
            ]
          }
        ]
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      });
      webhook.send({
        embeds: [
          {
            color: 0xf54542,
            title: 'Error Log',
            fields: [
              {
                name: `Time`,
                value: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
                inline: true
              },
              {
                name: `User`,
                value: interaction?.user?.username,
                inline: true
              },
              {
                name: `Command`,
                value: interaction.commandName,
                inline: true
              },
              {
                name: 'Error',
                value: codeBlock(error.stack)
              }
            ]
          }
        ]
      });
    }
  }
};

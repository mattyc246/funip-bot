import fs from 'node:fs';
import path from 'node:path';
import {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  codeBlock
} from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const LOG_CHANNEL_ID = '1123908665930428446';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join('./', 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  import(`./${filePath}`).then((command) => {
    // // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  });
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const channel = await client.channels.fetch(LOG_CHANNEL_ID);
  const webhooks = await channel.fetchWebhooks();
  const webhook = webhooks.first();

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction, client);
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
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

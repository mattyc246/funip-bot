import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import dotenv from 'dotenv';
dotenv.config();

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();

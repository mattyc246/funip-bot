const { SlashCommandBuilder, codeBlock } = require('discord.js');

const commands = [
  {
    name: '/ping',
    description: 'Replies with Pong!'
  },
  {
    name: '/spreadsheet',
    description: 'Get the URL to the clan spreadsheet'
  },
  {
    name: '/open',
    description: 'Check the current number of open spots in each clan'
  },
  {
    name: '/2x',
    description: 'Check the next upcoming 2x event!'
  },
  {
    name: '/10x',
    description: 'Check the next upcoming 10x event!'
  },
  {
    name: '/ehp',
    description: 'Calculate the effective HP from HP and DEF'
  },
  {
    name: '/resist',
    description: 'Calculate % chance to resist debuff from ACC & RES'
  },
  {
    name: '/debuff',
    description: 'Calculate % chance to land debuff from ACC & RES'
  }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('List out all commands'),
  async execute(interaction) {
    const textString = codeBlock(
      'COMMANDS\n' +
        commands
          .map(
            (command) =>
              `=====================\n${command.name}\n${command.description}\n\n`
          )
          .join('')
    );
    await interaction.reply(textString);
  }
};

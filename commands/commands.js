const { SlashCommandBuilder } = require('discord.js');

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
    name: '/cvc',
    description: 'Check the upcoming CVC tournament details'
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
  },
  {
    name: '/fusion',
    description: 'Shows the current fusion details and fusion planner'
  },
  {
    name: '/totw',
    description: 'Upload your team of the week'
  },
  {
    name: '/add_optimizer',
    description: 'Create your optimizer profile'
  },
  {
    name: '/get_optimizer',
    description: 'Search for a users optimizer profile'
  }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('List out all commands'),
  async execute(interaction) {
    const fields = commands?.map((command) => {
      return {
        name: command.name,
        value: command.description
      };
    });

    const embedObject = {
      color: 0xffffff,
      title: 'Bot Commands',
      description: 'List of available bot commands for FuNip bot.',
      fields: fields
    };

    await interaction.reply({ content: 'Thanks nerd!', ephemeral: true });
    await interaction.channel.send({
      embeds: [embedObject]
    });
  }
};

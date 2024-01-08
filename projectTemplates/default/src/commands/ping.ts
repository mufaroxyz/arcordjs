import { Command } from 'arcord';
import {
  SlashCommandBuilder,
} from 'discord.js';

const command = new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!');

export default new Command({
  data: command,
  run: async ({ interaction }) => {

    await interaction.reply({
      content: `Pong! ${interaction.client.ws.ping}ms`,
      ephemeral: false,
    });

    },
});
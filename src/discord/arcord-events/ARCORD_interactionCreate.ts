import { CommandInteractionOptionResolver } from 'discord.js';
import { EventListener } from '../classes/index.js';

export default new EventListener('interactionCreate', async (client, interaction) => {
  if (
    interaction.isChatInputCommand() ||
    interaction.isContextMenuCommand() ||
    interaction.isUserContextMenuCommand()
  ) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.run({
        interaction,
        client,
        args: interaction.options as CommandInteractionOptionResolver,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  } else if (interaction.isButton()) {
    const [id, argStr] = interaction.customId.split('@');
    const args = argStr.split(';');

    const button = client.buttons.get(id);
    if (!button) return;

    try {
      await button.run({
        interaction,
        client,
        args,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this button!',
        ephemeral: true,
      });
    }
  }
});

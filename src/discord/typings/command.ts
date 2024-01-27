import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  ContextMenuCommandBuilder,
  PermissionResolvable,
  SlashCommandBuilder,
} from 'discord.js';

import Bot from '../bot.js';

interface CommandRunOptions {
  client: Bot;
  interaction: CommandInteraction;
  args: CommandInteractionOptionResolver;
}

type RunFunction = (options: CommandRunOptions) => Promise<void>;

export type CommandType = {
  userPermissions?: PermissionResolvable[];
  data: ContextMenuCommandBuilder | SlashCommandBuilder;
  run: RunFunction;
};

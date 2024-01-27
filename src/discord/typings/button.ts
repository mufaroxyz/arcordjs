import { ButtonInteraction } from 'discord.js';

import Bot from '../bot.js';

interface ButtonRunOptions {
  client: Bot;
  interaction: ButtonInteraction;
  args: string[];
}

type ButtonRunFunction = (options: ButtonRunOptions) => Promise<void>;

export type ButtonType = {
  id: string;
  run: ButtonRunFunction;
};

import { ButtonBuilder } from 'discord.js';

export class ButtonStruct extends ButtonBuilder {
  constructor(options: ButtonStructOptions) {
    super();
    if (options.id.includes('@')) console.warn('Button ID cannot include "@"');
    else this.setCustomId(`${options.id}@${options.args.join(';')}`);
  }
}

import { ButtonBuilder } from 'discord.js';
import { ButtonStructOptions } from '../typings/button-struct';

export class ButtonStruct extends ButtonBuilder {
  constructor(options: ButtonStructOptions) {
    super();
    if (options.id.includes('@')) console.warn('Button ID cannot include "@"');
    else this.setCustomId(`${options.id}@${options.args.join(';')}`);
  }
}

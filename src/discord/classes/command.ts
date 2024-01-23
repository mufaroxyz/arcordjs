import { CommandType } from '../typings/command.js';

export class Command {
  constructor(commandOptions: CommandType) {
    Object.assign(this, commandOptions);
  }
}

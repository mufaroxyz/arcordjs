import { ClientEvents } from 'discord.js';
import Bot from '../bot';

export class EventListener<Key extends keyof ClientEvents> {
  constructor(public name: Key, public run: (client: Bot, ...args: ClientEvents[Key]) => void) {
    return this;
  }
}

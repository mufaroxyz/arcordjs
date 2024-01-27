import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  DiscordjsErrorCodes,
  GatewayIntentBits,
} from 'discord.js';

import arcordConfig from '../functions/arcord-config.js';
import { ArcordError } from '../types/ErrorCodes.js';
import { default as ARCORD_interactionCreate } from './arcord-events/ARCORD_interactionCreate.js';
import { Loader } from './loader.js';
import { Logger } from './services/logger.js';
import { ButtonType } from './typings/button.js';
import { CommandType } from './typings/command.js';
import { EventType } from './typings/event.js';

export default class Bot extends Client {
  public commands = new Map<string, CommandType>();
  public events = new Map<string, EventType>();
  public buttons = new Map<string, ButtonType>();
  public config = arcordConfig();

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });
  }

  async registerCommands() {
    const JSONCommands: ApplicationCommandDataResolvable[] = [];

    const commandLoader = new Loader<CommandType>('commands');

    this.commands = await commandLoader.load();

    this.commands.forEach(command => {
      JSONCommands.push(command.data.toJSON());
    });

    await (await this.guilds.fetch(this.config.guildId)).commands.set(JSONCommands);
  }

  async registerEvents() {
    const eventLoader = new Loader<EventType>('events');

    this.events = await eventLoader.load();
    this.events.set('ARCORD_interactionCreate', ARCORD_interactionCreate as EventType);

    this.events.forEach(event => {
      this.on(event.name.replace(/ARCORD_/gi, '') as keyof ClientEvents, (...args) =>
        event.run(this, ...args)
      );
    });
  }

  async registerButtons() {
    const buttonLoader = new Loader<ButtonType>('buttons');

    this.buttons = await buttonLoader.load();
  }

  async start() {
    Logger.info('Registering core components');
    await Promise.all([this.registerEvents(), this.registerButtons()]);

    await this.login(this.config.token).catch(err => {
      if (err.code === DiscordjsErrorCodes.TokenInvalid) {
        throw new Error(ArcordError.TokenInvalid);
      } else {
        throw new Error(err);
      }
    });

    this.on('ready', async () => {
      await this.registerCommands();
      Logger.info('Bot started', {
        tag: this.user?.tag,
        id: this.user?.id,
      });
    });
  }
}

import {
  Client,
  GatewayIntentBits,
  DiscordjsErrorCodes,
  ApplicationCommand,
  ApplicationCommandDataResolvable,
  ClientEvents,
} from 'discord.js';
import { Preloader } from './preload';
import { CommandType } from './typings/command';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
// import { markedTerminal } from 'marked-terminal';
import { EventType } from './typings/event';
import { ButtonType } from './typings/button';

import { default as ARCORD_interactionCreate } from './arcord-events/ARCORD_interactionCreate';

// marked.use(markedTerminal() as any);

export default class Bot extends Client {
  public commands = new Map<string, CommandType>();
  public events = new Map<string, EventType>();
  public buttons = new Map<string, ButtonType>();

  public loadingSpinner = createSpinner(chalk.yellow`Initalizing bot...`)
    .spin()
    .start();

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });
  }

  async registerCommands() {
    this.loadingSpinner.update({
      text: chalk.yellow`Loading commands...`,
    });

    const JSONCommands: ApplicationCommandDataResolvable[] = [];

    const commandLoader = new Preloader<CommandType>('commands');

    this.commands = await commandLoader.load();

    this.commands.forEach(command => {
      JSONCommands.push(command.data.toJSON());
    });

    await (await this.guilds.fetch('987090776670486528')).commands.set(JSONCommands);
  }

  async registerEvents() {
    const eventLoader = new Preloader<EventType>('events');

    this.events = await eventLoader.load();
    this.events.set('ARCORD_interactionCreate', ARCORD_interactionCreate as EventType);

    this.events.forEach(event => {
      this.on(event.name.replace(/ARCORD_/gi, '') as keyof ClientEvents, (...args) =>
        event.run(this, ...args)
      );
    });
  }

  async registerButtons() {
    const buttonLoader = new Preloader<ButtonType>('buttons');

    this.buttons = await buttonLoader.load();
  }

  async start(token: string) {
    this.loadingSpinner.update({
      text: chalk.yellow`Preloading handlers...`,
    });

    await Promise.all([this.registerEvents(), this.registerButtons()]);

    await this.login(token).catch(err => {
      if (err.code === DiscordjsErrorCodes.TokenInvalid) {
        this.loadingSpinner.error({
          text: chalk.red`An invalid token was provided in arcord.json file!`,
        });
        throw new Error('An invalid token was provided in arcord.json file!');
      } else {
        throw new Error(err);
      }
    });

    this.once('ready', async () => {
      await this.registerCommands();

      // this.loadingSpinner.success({
      //   text: `${chalk.bold.magenta`Arcord.js - Logged in as ${this.user?.tag!}`}\n${marked(
      //     `> **Commands:** ${this.commands.size}\n> **Events:** ${this.events.size}\n> **Buttons:** ${this.buttons.size}`
      //   )}
      //   `,
      // });
    });
  }
}

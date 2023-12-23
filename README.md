# ⚠️ Arcord is currently in early development, there's no way of using it in production. It's not even optimized for Dev and it's not published on NPM.

# Arcord.js

Arcord.js is a framework for creating Discord bots in JavaScript. It is built on top of [discord.js](https://discord.js.org/#/), and provides a simple way to create commands and events.

It uses a file based system to manage commands, events and other files. This means that you can easily create new commands without having to write the boring boilerplate code.

## Installation

To install Arcord.js, you need to have [Node.js](https://nodejs.org/en/) installed. Then, run the following command in your terminal:

```bash
npm install arcord.js
```

Then edit your `arcord.json` file to add your bot token:

```json
{
  "token": "your bot token"
}
```

## Usage

To create a new command, create a new file in the `commands` folder. For example, here's a `ping.ts` file:

```ts
import { ButtonStruct, Command } from 'arcord';
import {
  SlashCommandBuilder,
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  ButtonStyle,
} from 'discord.js';

const command = new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!');

export default new Command({
  data: command,
  run: async ({ interaction }) => {
    const exampleButton = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonStruct({ id: 'test', args: ['123', '32'] })
        .setLabel('hello')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: `Pong! ${interaction.client.ws.ping}ms`,
      ephemeral: false,
      components: [exampleButton],
    });
  },
});
```

In this example, it also shows how to use the `ButtonStruct` class to create buttons with dynamic arguments (with a limit of 100 characters in Discord's custom_id property).

To use that button, you need to create a new file in the `buttons` folder. Let's make a `test.ts` file:

```ts
import { Button } from 'arcord';

export default new Button({
  id: 'test',
  run: async ({ interaction, args }) => {
    await interaction.reply({
      content: `Hello! Args: ${args.join(', ')}`,
      ephemeral: true,
    });
  },
});
```

The id of the button is the same as the id of the `ButtonStruct` in the `ping.ts` file.

##### Events

To create a new event, create a new file in the `events` folder. For example, here's a `ready.ts` file:

```ts
import { EventListener } from 'arcord';

// Automatically uses ClientEvent type for intelisense
export default new EventListener('ready', async client => {
  console.log(`Hello!`);
});
```

## Running

Use the following command to run your bot in the directory with the `arcord.json` file:

```bash
arcord dev
# Or if it doesn't work,
npx arcord dev
```

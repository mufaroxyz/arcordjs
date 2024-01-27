# ⚠️ Arcord is currently in early development, and is most likely not good enough to use it in production yet

# Arcord.js

Arcord.js is a framework for creating Discord bots in JavaScript. It is built on top of [discord.js](https://discord.js.org/#/), and provides a simple way to create commands and events.

It uses a file based system to manage commands, events and other handling. This means that you can easily create new commands without having to write the boring boilerplate code.

## Installation

To install Arcord.js, you need to have [Node.js](https://nodejs.org/en/) or [Bun](https://bun.sh/) (recommended) installed. Then, run the following command in your terminal:

```bash
npx arcordjs init
pnpx arcordjs init
bunx arcordjs init
```

Make sure to configure your bot in `arcord.config.json`

```json
{
  "token": "your bot token",
  "guildId": "Your development guild to locally update commands in"
}
```

## Usage

To create a new command, create a new file in the `commands` folder. For example, here's a `ping.ts` file:

```ts
import { ButtonStruct, Command } from 'arcordjs';
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
import { Button } from 'arcordjs';

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
import { EventListener } from 'arcordjs';

// Automatically uses ClientEvent type for intelisense
export default new EventListener('ready', async client => {
  console.log(`Hello!`);
});
```

## Running

Use the following command to run your bot in the root directory of the project:

```bash
npm run dev
pnpm run dev
bun run dev
```

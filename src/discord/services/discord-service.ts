import {
  ApplicationCommand,
  Channel,
  Client,
  DiscordAPIError,
  Guild,
  GuildMember,
  NewsChannel,
  RESTJSONErrorCodes as DiscordApiErrors,
  Role,
  StageChannel,
  TextChannel,
  User,
  VoiceChannel,
} from 'discord.js';

import { PermissionService, RegexService } from './index.js';

const FETCH_MEMBER_LIMIT = 20;
const IGNORED_ERRORS = [
  DiscordApiErrors.UnknownMessage,
  DiscordApiErrors.UnknownChannel,
  DiscordApiErrors.UnknownGuild,
  DiscordApiErrors.UnknownMember,
  DiscordApiErrors.UnknownUser,
  DiscordApiErrors.UnknownInteraction,
  DiscordApiErrors.MissingAccess,
];

export class DiscordService {
  public static async getGuild(client: Client, discordId: string): Promise<Guild> {
    discordId = RegexService.discordId(discordId);
    if (!discordId) {
      return;
    }

    try {
      return await client.guilds.fetch(discordId);
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        typeof error.code === 'number' &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async getChannel(client: Client, discordId: string): Promise<Channel> {
    discordId = RegexService.discordId(discordId);
    if (!discordId) {
      return;
    }

    try {
      return await client.channels.fetch(discordId);
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        typeof error.code === 'number' &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async getUser(client: Client, discordId: string): Promise<User> {
    discordId = RegexService.discordId(discordId);

    try {
      return await client.users.fetch(discordId);
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        typeof error.code === 'number' &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async findAppCommand(client: Client, name: string): Promise<ApplicationCommand> {
    const commands = await client.application.commands.fetch();
    return commands.find(command => command.name === name);
  }

  public static async findMember(guild: Guild, input: string): Promise<GuildMember> {
    try {
      const discordId = RegexService.discordId(input);
      if (discordId) {
        return await guild.members.fetch(discordId);
      }

      const tag = RegexService.tag(input);
      if (tag) {
        return (await guild.members.fetch({ query: tag.username, limit: FETCH_MEMBER_LIMIT })).find(
          member => member.user.discriminator === tag.discriminator
        );
      }

      return (await guild.members.fetch({ query: input, limit: 1 })).first();
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        typeof error.code === 'number' &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async findRole(guild: Guild, input: string): Promise<Role> {
    try {
      const discordId = RegexService.discordId(input);
      if (discordId) {
        return await guild.roles.fetch(discordId);
      }

      const search = input.trim().toLowerCase().replace(/^@/, '');
      const roles = await guild.roles.fetch();
      return (
        roles.find(role => role.name.toLowerCase() === search) ??
        roles.find(role => role.name.toLowerCase().includes(search))
      );
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        typeof error.code === 'number' &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async findTextChannel(
    guild: Guild,
    input: string
  ): Promise<NewsChannel | TextChannel> {
    try {
      const discordId = RegexService.discordId(input);
      if (discordId) {
        const channel = await guild.channels.fetch(discordId);
        if (channel instanceof NewsChannel || channel instanceof TextChannel) {
          return channel;
        } else {
          return;
        }
      }

      const search = input.trim().toLowerCase().replace(/^#/, '').replaceAll(' ', '-');
      const channels = [...(await guild.channels.fetch()).values()]
        .filter(channel => channel instanceof NewsChannel || channel instanceof TextChannel)
        .map(channel => channel as NewsChannel | TextChannel);
      return (
        channels.find(channel => channel.name.toLowerCase() === search) ??
        channels.find(channel => channel.name.toLowerCase().includes(search))
      );
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        typeof error.code === 'number' &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async findVoiceChannel(
    guild: Guild,
    input: string
  ): Promise<VoiceChannel | StageChannel> {
    try {
      const discordId = RegexService.discordId(input);
      if (discordId) {
        const channel = await guild.channels.fetch(discordId);
        if (channel instanceof VoiceChannel || channel instanceof StageChannel) {
          return channel;
        } else {
          return;
        }
      }

      const search = input.trim().toLowerCase().replace(/^#/, '');
      const channels = [...(await guild.channels.fetch()).values()]
        .filter(channel => channel instanceof VoiceChannel || channel instanceof StageChannel)
        .map(channel => channel as VoiceChannel | StageChannel);
      return (
        channels.find(channel => channel.name.toLowerCase() === search) ??
        channels.find(channel => channel.name.toLowerCase().includes(search))
      );
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        typeof error.code === 'number' &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async findNotifyChannel(guild: Guild): Promise<TextChannel | NewsChannel> {
    // Prefer the system channel
    const { systemChannel } = guild;
    if (systemChannel && PermissionService.canSend(systemChannel, true)) {
      return systemChannel;
    }

    // Otherwise look for a bot channel
    return (await guild.channels.fetch()).find(
      channel =>
        (channel instanceof TextChannel || channel instanceof NewsChannel) &&
        PermissionService.canSend(channel, true)
    ) as TextChannel | NewsChannel;
  }
}

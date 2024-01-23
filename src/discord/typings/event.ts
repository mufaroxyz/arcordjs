import { ClientEvents } from 'discord.js';
import { EventListener } from '../classes/index.js';

export type EventType = EventListener<keyof ClientEvents>;

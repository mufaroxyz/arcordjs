import { ClientEvents } from 'discord.js';
import { EventListener } from '../classes';

export type EventType = EventListener<keyof ClientEvents>;

import { ClientEvents } from 'discord.js';

import { EventListener } from '../classes/event.js';

export type EventType = EventListener<keyof ClientEvents>;

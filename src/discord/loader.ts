import { glob } from 'glob';
import path from 'path';
import { pathToFileURL } from 'url';

import { ButtonType } from './typings/button.js';
import { CommandType } from './typings/command.js';
import { EventType } from './typings/event.js';

async function importFresh(modulePath: string) {
  const cacheBustingModulePath = pathToFileURL(`${modulePath}`).toString() + `?v=${Date.now()}`;
  return (await import(cacheBustingModulePath)).default;
}

export class Loader<T extends CommandType | EventType | ButtonType> {
  constructor(private path: string) {}

  async load(): Promise<Map<string, T>> {
    const filesPath = path
      .join(process.cwd(), '.arcord', 'cache', this.path, '**/*.{js,ts}')
      .replace(/\\/g, '/');

    const files = await glob(filesPath);

    const modules = await Promise.all(
      files.map(async file => {
        const command = await importFresh(file);
        return command;
      })
    );

    return await this.mapModules(modules);
  }

  async mapModules(modules: T[]): Promise<Map<string, T>> {
    const map = new Map<string, T>();

    for (const module of modules) {
      if ('data' in module) map.set(module.data.name, module);
      else if ('name' in module) map.set(module.name, module);
      else map.set(module.id, module);
    }

    return map;
  }
}

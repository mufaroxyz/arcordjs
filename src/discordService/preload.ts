import { glob } from 'glob';
import path from 'path';
import { CommandType } from './typings/command.js';
import { EventType } from './typings/event.js';
import { ButtonType } from './typings/button.js';

export class Preloader<T extends CommandType | EventType | ButtonType> {
  constructor(private path: string) {}

  async load(): Promise<Map<string, T>> {
    const filesPath = path
      .join(process.cwd(), '.arcord', this.path, '**/*.{js,ts}')
      .replace(/\\/g, '/');

    const files = await glob(filesPath);

    const modules = await Promise.all(
      files.map(async file => {
        delete require.cache[require.resolve(file)];
        const { default: command } = await import(file);
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

import path from 'path';
import chokidar from 'chokidar';

import { exec } from 'child_process';
import chalk from 'chalk';
import Bot from '../../discordService/bot';
import arcordConfig from '../../functions/arcord-config';

function getFileNameFromPath(filePath: string) {
  return filePath.split(path.sep).pop();
}

export default function devAction() {
  let bot = new Bot();

  const projectDir = path.join(process.cwd(), 'src');

  const watcher = chokidar.watch(projectDir, {
    ignored: /[\/\\]\./,
    persistent: true,
  });

  let watcherInitialized = false;

  watcher
    .on('add', filePath => {
      console.clear();
      if (!watcherInitialized) return;
      console.log(
        `[${chalk.green`+`}] Added file ${getFileNameFromPath(filePath)}. Recompiling...`
      );
      restartBot();
    })
    .on('change', filePath => {
      console.clear();
      console.log(
        `[${chalk.yellow`*`}] Modified file ${getFileNameFromPath(filePath)}. Recompiling...`
      );
      restartBot();
    })
    .on('unlink', filePath => {
      console.clear();
      console.log(
        `[${chalk.red`-`}] Deleted file ${getFileNameFromPath(filePath)}. Recompiling...`
      );
      restartBot();
    });

  watcher.on('error', error => console.error(`Watcher error: ${error}`));

  watcher.on('ready', async () => {
    if (!watcherInitialized) {
      console.clear();
      watcherInitialized = true;
      exec(`tsc-watch --noClear --silent`);

      // exec('ts-clean-built --old --out .arcord --dir src');
      startBot();
    }
  });

  async function startBot() {
    await bot.start(arcordConfig().token);
  }

  async function restartBot() {
    // exec('ts-clean-built --old --out .arcord --dir src');
    await bot.destroy();
    bot = new Bot();
    startBot();
  }
}

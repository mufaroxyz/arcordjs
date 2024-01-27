import chalk from 'chalk';
import { exec } from 'child_process';
import chokidar from 'chokidar';
import path from 'path';

import Bot from '../../discord/bot.js';

function getFileNameFromPath(filePath: string) {
  return filePath.split(path.sep).pop();
}

export default function devAction() {
  let bot = new Bot();

  const projectDir = path.join(process.cwd(), 'src');

  const watcher = chokidar.watch(projectDir, {
    ignored: /[/\\]\./,
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
      watcherInitialized = true;
      const ex = exec(`swc compile ${projectDir}  --quiet --watch --out-dir .arcord/cache/`);
      ex.stdout?.pipe(process.stdout);
      ex.stderr?.pipe(process.stderr);

      startBot();
    }
  });

  async function startBot() {
    await bot.start();
  }

  async function restartBot() {
    console.log('Restarting bot...');
    await bot.destroy().then(() => {
      bot = new Bot();
      startBot();
    });
  }
}

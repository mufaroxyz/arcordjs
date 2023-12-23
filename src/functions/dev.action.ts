import path from 'path';
import chokidar from 'chokidar';

import { exec } from 'child_process';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
import Bot from '../discordService/bot';
import arcordConfig from './arcord-config';

function getFileNameFromPath(filePath: string) {
  return filePath.split(path.sep).pop();
}

export default function devAction() {
  // console.log(chalk.bold.underline.magenta`\tArcord.js`, chalk.bold.cyan`\n\tDevelopment Server`);

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

      exec('ts-clean-built --old --out .arcord --dir src');
      startBot();
    }
  });

  async function startBot() {
    await bot.start(arcordConfig().token);
    // const BOT_PROCESS_CMD = `node --no-deprecation ${path.join(
    //   __dirname,
    //   '..',
    //   'discordService',
    //   'index.js'
    // )}`;

    // const botProcess = exec(`tsc-watch --noClear --silent --onSuccess "${BOT_PROCESS_CMD}"`, {});

    // botProcess.stdout?.on('data', data => {
    //   console.log(data.toString().trim());
    // });

    // botProcess.stderr?.on('data', data => {
    //   console.error(data);
    // });
  }

  async function restartBot() {
    exec('ts-clean-built --old --out .arcord --dir src');
    await bot.destroy();
    bot = new Bot();
    startBot();
  }
}

import inquirer, { Answers, DistinctQuestion } from 'inquirer';
import { PM } from './package-manager.js';
import validate from 'validate-npm-package-name';
import chalk from 'chalk';
import { getCurrentPackageManager } from './package-manager.js';
// import { version } from '../../package.json' assert { type: 'json' };
import { createRequire } from 'node:module';

type ExpectedAnswers = {
  projectName: string;
  manager: PM;
};

const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

export async function ask(): Promise<ExpectedAnswers> {
  // const { version }: { version: string } = await Bun.file(new URL('../../package.json', import.meta.url)).json();
  console.log(chalk.magenta`arcord.js`, ' - ', version);

  return await safePrompt<ExpectedAnswers>([
    {
      name: 'projectName',
      message: 'What is your project name',
      default: 'my-bot',
      validate(input: string) {
        return validate(input).errors?.join('\n') ?? true;
      },
      transformer(input: string) {
        return input.replaceAll(/\s+/g, '');
      },
      prefix: chalk.cyan('?'),
      suffix: '?',
    },
    {
      name: 'manager',
      message: 'Which package manage would you use',
      type: 'list',
      default: getCurrentPackageManager(),
      choices: [
        // I've got fucking headaches over node's ESM resolution im not fucking touching it make it bun only
        { name: 'npm', value: PM.npm },
        { name: 'yarn', value: PM.yarn },
        { name: 'pnpm', value: PM.pnpm },
        { name: 'bun (recommended)', value: PM.bun },
        {
          name: 'none - do not install packages',
          value: PM.none,
        },
      ],
      prefix: chalk.cyan('>'),
      suffix: '?',
    },
  ]);
}

export async function safePrompt<T extends Answers>(questions: DistinctQuestion<T>[]) {
  const promptModule = inquirer.createPromptModule();
  const ui = new inquirer.ui.Prompt<T>(promptModule.prompts);

  // @ts-ignore
  const { rl } = ui;
  rl.listeners('SIGINT').forEach(listener => rl.off('SIGINT', listener as () => unknown));

  function handleCtrlC() {
    // remove the listener
    rl.off('SIGINT', handleCtrlC);

    // Clean up inquirer
    // @ts-ignore
    ui.close();

    // Then reject our promise
    process.exit(0);
  }
  rl.on('SIGINT', handleCtrlC);

  return ui.run(questions);
}

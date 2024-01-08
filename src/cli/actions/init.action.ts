import * as fs from 'fs';
import { PM, install } from '../../functions/package-manager.js';
import path, { basename, dirname, join } from 'path';
import { Answers } from 'inquirer';
import { templates, templatesDir } from '../../functions/template.js';
import { createSpinner } from 'nanospinner';
import chalk from 'chalk';

export default async function initAction() {
  const projectPath = path.resolve('arcord-project');

  const projectName = 'arcord-project';

  const pm: any = 'pnpm';

  await copy(templates[0], projectPath, pm);

  await install(PM.npm, projectPath);

  console.log(
    chalk.greenBright('√'),
    chalk.bold('Created discord.js project'),
    chalk.gray('»'),
    chalk.greenBright(projectName)
  );

  console.log(chalk.blueBright('?'), chalk.bold('Next Steps!'));
  console.log(`\t> cd ${path.relative(process.cwd(), projectPath)}`);
  console.log(`\t> // Configure your bot in .arcord.json`);

  if (pm !== PM.none) console.log(`\t> ${PM[pm]} run dev`);
  else {
    console.log('\t> npm install');
    console.log('\t> npm run dev');
  }
}

async function copy(template: string, path: string, pm: PM) {
  const spinner = createSpinner('Copying template').start();

  const name = basename(path);

  const source = join(templatesDir, template);

  try {
    fs.cpSync(source, path, { recursive: true });

    const pkgJsonUrl = join(path, 'package.json');
    const pkg: Record<string, unknown> = JSON.parse(fs.readFileSync(pkgJsonUrl, 'utf8'));

    pkg.name = name.toLowerCase();
    if (pm === PM.npm) delete pkg.resolutions;
    else if (pm === PM.none) delete pkg.overrides;

    fs.writeFileSync(pkgJsonUrl, JSON.stringify(pkg, null, 4));

    spinner.success();
  } catch (err) {
    spinner.error({ text: err.toString() });
    process.exit(2);
  }
}

async function prompt() {}

// async function safePrompt<T extends Answers>() {}

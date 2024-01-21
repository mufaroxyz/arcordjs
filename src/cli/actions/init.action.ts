import * as fs from 'fs';
import { PM, install } from '../../functions/package-manager.js';
import path, { basename, join } from 'path';
import { templates, templatesDir } from '../../functions/template.js';
import { createSpinner } from 'nanospinner';
import chalk from 'chalk';
import { ask } from '../../functions/inquirer-ask.js';

export default async function initAction() {
  const answers = await ask();

  const projectPath = path.resolve(answers.projectName);
  const projectName = answers.projectName;

  const pm = answers.manager;

  await copy(templates[0], projectPath, pm);

  if(pm !== PM.none)
    await install(pm, projectPath);

  console.log(
    chalk.greenBright('✔'),
    chalk.bold(`Created ${chalk.magenta`arcord.js`} project`),
    chalk.gray('»'),
    chalk.greenBright(projectName)
  );

  console.log(chalk.blueBright('?'), chalk.bold('Next Steps'));
  console.log(`\t➜ cd ${path.relative(process.cwd(), projectPath)}`);
  console.log(`\t➜ Configure your bot in arcord.config.json`);

  if (pm !== PM.none) console.log(`\t➜ ${PM[pm]} run dev`);
  else {
    console.log('\t➜ npm install');
    console.log('\t➜ npm run dev');
  }
}

async function copy(template: string, path: string, pm: PM) {
  const spinner = createSpinner('Copying files').start();

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

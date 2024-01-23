import { Command } from 'commander';
import buildAction from './actions/build.action.js';

const devCommand = new Command()
  .command('build')
  .description('Build the project')
  .action(buildAction);

export default devCommand;

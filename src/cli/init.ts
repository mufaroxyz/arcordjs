import { Command } from 'commander';
import initAction from './actions/init.action';

const initCommand = new Command()
  .command('init')
  .description('Initialize the project')
  .action(initAction);

export default initCommand;

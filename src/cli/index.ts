#!/usr/bin/env node

import { Command } from 'commander';
import devCommand from './dev';
import initCommand from './init';

const program = new Command();
program.version('0.1.0');

program.addCommand(devCommand);
program.addCommand(initCommand);

program.parse(process.argv);

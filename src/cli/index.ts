#!/usr/bin/env node

import { Command } from 'commander';
import { createRequire } from 'module';

import devCommand from './dev.js';
import initCommand from './init.js';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

const program = new Command();
program.version(version);

program.addCommand(devCommand);
program.addCommand(initCommand);

program.parse(process.argv);

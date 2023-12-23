#!/usr/bin/env node

import { Command } from "commander";
import devCommand from "./dev";

const program = new Command();
program.version("0.1.0");

program.addCommand(devCommand);

program.parse(process.argv);

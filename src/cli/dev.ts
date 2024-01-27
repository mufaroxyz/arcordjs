import { Command } from "commander";

import devAction from "./actions/dev.action.js";

const devCommand = new Command()
    .command("dev")
    .description("Start the development environment")
    .action(devAction);

export default devCommand;

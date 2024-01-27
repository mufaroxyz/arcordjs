import * as cp from 'child_process';

import { Logger } from '../../discord/services/logger.js';
import { ArcordError } from '../../types/ErrorCodes.js';

export default function buildAction() {
  Logger.warn(ArcordError.ExperimentalNotFinished);
  const sh = cp.exec('swc src --out-dir out');
  sh.stdout?.pipe(process.stdout);
  sh.stderr?.pipe(process.stderr);
  sh.on('exit', code => {
    console.log(`child process exited with code ${code}`);
  });
}

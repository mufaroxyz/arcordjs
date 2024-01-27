import * as cp from 'child_process';
import path from 'path';

export default function buildAction() {
  const sh = cp.exec(`swc src --out-dir out`);
  sh.stdout?.pipe(process.stdout);
  sh.stderr?.pipe(process.stderr);
  sh.on('exit', code => {
    console.log(`child process exited with code ${code}`);
  });
}

import { exec, spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const serverProc = spawn(npmCmd, ['--prefix', 'server', 'run', 'dev'], {
  stdio: 'inherit',
  shell: isWindows,
});

const clientProc = spawn(npmCmd, ['--prefix', 'client', 'run', 'dev'], {
  stdio: 'inherit',
  shell: isWindows,
});

function terminateTree(proc) {
  if (!proc || proc.killed || !proc.pid) return;
  if (isWindows) {
    exec(`taskkill /pid ${proc.pid} /T /F`, () => {});
  } else {
    proc.kill('SIGTERM');
  }
}

let shuttingDown = false;
function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  terminateTree(serverProc);
  terminateTree(clientProc);
  setTimeout(() => process.exit(code), 200);
}

serverProc.on('exit', (code) => {
  if (!shuttingDown && code !== 0) shutdown(code ?? 1);
});

clientProc.on('exit', (code) => {
  if (!shuttingDown && code !== 0) shutdown(code ?? 1);
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

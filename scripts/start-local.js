const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';

const children = new Set();

function log(name, data, isError = false) {
  const stream = isError ? process.stderr : process.stdout;
  String(data)
    .split(/\r?\n/)
    .filter(Boolean)
    .forEach(line => stream.write(`[${name}] ${line}\n`));
}

function quoteWindows(value) {
  const text = String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function normalizeCommand(command, args) {
  if (!isWindows) {
    return { command, args };
  }

  const commandLine = [quoteWindows(command), ...args.map(quoteWindows)].join(' ');
  return {
    command: 'cmd.exe',
    args: ['/d', '/s', '/c', `"${commandLine}"`],
    windowsVerbatimArguments: true
  };
}

function run(name, command, args, cwd, options = {}) {
  const normalized = normalizeCommand(command, args);
  const child = spawn(normalized.command, normalized.args, {
    cwd,
    env: { ...process.env, ...(options.env || {}) },
    shell: false,
    windowsVerbatimArguments: normalized.windowsVerbatimArguments || false,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  children.add(child);
  child.stdout.on('data', data => log(name, data));
  child.stderr.on('data', data => log(name, data, true));

  child.on('error', error => {
    children.delete(child);
    log('local', `${name} nao iniciou: ${error.message}`, true);
    if (!shuttingDown && !options.allowExit) {
      shutdown(1);
    }
  });

  child.on('exit', code => {
    children.delete(child);
    if (!shuttingDown && !options.allowExit) {
      log('local', `${name} encerrou com codigo ${code}. Encerrando os demais processos.`, true);
      shutdown(code || 1);
    }
  });

  return child;
}

function runBlocking(name, command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = run(name, command, args, cwd, { allowExit: true });
    child.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`${name} falhou com codigo ${code}.`));
    });
  });
}

function isPortAvailable(port) {
  return new Promise(resolve => {
    const server = net.createServer();

    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

async function findAvailablePort(preferredPort, blockedPorts = new Set()) {
  const start = Number(preferredPort);
  for (let port = start; port < start + 100; port += 1) {
    if (blockedPorts.has(port)) {
      continue;
    }
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`Nenhuma porta livre encontrada entre ${start} e ${start + 99}.`);
}

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill(isWindows ? undefined : 'SIGTERM');
    }
  }
  setTimeout(() => process.exit(code), 300);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

(async () => {
  try {
    log('local', 'Subindo MySQL via Docker Compose...');
    try {
      await runBlocking('db', 'docker', ['compose', 'up', '-d', 'mysql'], rootDir);
    } catch (error) {
      log('local', `${error.message} Continuando; se voce usa MySQL local, isso pode ser ignorado.`, true);
    }

    const requestedBackendPort = Number(process.env.SERVER_PORT || process.env.BACKEND_PORT || 8080);
    const backendPort = await findAvailablePort(requestedBackendPort);
    if (backendPort !== requestedBackendPort) {
      log('local', `Porta ${requestedBackendPort} ocupada. Usando backend em http://localhost:${backendPort}/api`);
    } else {
      log('local', `Iniciando backend em http://localhost:${backendPort}/api`);
    }
    run(
      'backend',
      path.join(rootDir, 'backend', 'mvnw.cmd'),
      ['spring-boot:run'],
      path.join(rootDir, 'backend'),
      { env: { SERVER_PORT: String(backendPort) } }
    );

    const requestedFrontendPort = Number(process.env.FRONTEND_PORT || 3000);
    const frontendPort = await findAvailablePort(requestedFrontendPort, new Set([backendPort]));
    if (frontendPort !== requestedFrontendPort) {
      log('local', `Porta ${requestedFrontendPort} ocupada. Usando frontend em http://localhost:${frontendPort}`);
    } else {
      log('local', `Iniciando frontend em http://localhost:${frontendPort}`);
    }
    run(
      'frontend',
      process.execPath,
      ['server.js'],
      path.join(rootDir, 'frontend'),
      {
        env: {
          FRONTEND_PORT: String(frontendPort),
          BACKEND_PORT: String(backendPort),
          BACKEND_API_URL: `http://localhost:${backendPort}/api`
        }
      }
    );

    log('local', `Ambiente iniciado. Acesse http://localhost:${frontendPort} e use Ctrl+C para encerrar backend e frontend.`);
  } catch (error) {
    log('local', error.message, true);
    shutdown(1);
  }
})();

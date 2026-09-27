const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const venvPy = path.join(__dirname, 'ai-service', '.venv', 'Scripts', 'python.exe');
const venvPyUnix = path.join(__dirname, 'ai-service', '.venv', 'bin', 'python');

let pyCmd = 'python';
if (fs.existsSync(venvPy)) {
  pyCmd = venvPy;
} else if (fs.existsSync(venvPyUnix)) {
  pyCmd = venvPyUnix;
} else {
  pyCmd = process.platform === 'win32' ? 'py' : 'python3';
}

const child = spawn(pyCmd, [path.join(__dirname, 'ai-service', 'app.py')], {
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

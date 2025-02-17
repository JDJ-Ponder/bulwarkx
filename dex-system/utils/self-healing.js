const http = require('http');
const { exec } = require('child_process');

const SERVER_URL = 'http://localhost:3001'; // Adjust if your backend runs on a different port

/**
 * Checks if the backend server is running.
 * @returns {Promise<boolean>} True if server is running, false otherwise.
 */
function isServerRunning() {
  return new Promise((resolve) => {
    const req = http.get(SERVER_URL, (res) => {
      resolve(res.statusCode === 200);
      req.destroy(); // Clean up the request
    });

    req.on('error', (err) => {
      console.error(`Server check failed: ${err.message}`);
      resolve(false);
    });
    req.setTimeout(2000, () => { // Set timeout to 2 seconds
        console.error(`Server check timed out`);
        req.destroy();
        resolve(false);
    });
  });
}

/**
 * Restarts the backend server.
 */
function restartServer() {
  console.log('Attempting to restart the server...');
  exec('npm run start', { cwd: '../backend' }, (error, stdout, stderr) => { // Adjust the path if needed
    if (error) {
      console.error(`Error restarting server: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Server restart stderr: ${stderr}`);
      return;
    }
    console.log(`Server restart stdout: ${stdout}`);
    console.log('Server restarted successfully.');
  });
}

// Automated server check and restart
setInterval(async () => {
  const running = await isServerRunning();
  if (!running) {
    console.error('Server is not running!');
    restartServer();
  }
}, 5000); // Check every 5 seconds
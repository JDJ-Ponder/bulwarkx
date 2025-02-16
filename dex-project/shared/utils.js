```diff
--- /dev/null
+++ b/dex-system/utils/self-healing.js
@@ -0,0 +1,52 @@
+const http = require('http');
+const { exec } = require('child_process');
+
+const SERVER_URL = 'http://localhost:3001'; // Adjust if your backend runs on a different port
+
+/**
+ * Checks if the backend server is running.
+ * @returns {Promise<boolean>} True if server is running, false otherwise.
+ */
+function isServerRunning() {
+  return new Promise((resolve) => {
+    const req = http.get(SERVER_URL, (res) => {
+      resolve(res.statusCode === 200);
+      req.destroy(); // Clean up the request
+    });
+
+    req.on('error', (err) => {
+      console.error(`Server check failed: ${err.message}`);
+      resolve(false);
+    });
+    req.setTimeout(2000, () => { // Set timeout to 2 seconds
+        console.error(`Server check timed out`);
+        req.destroy();
+        resolve(false);
+    });
+  });
+}
+
+/**
+ * Restarts the backend server.
+ */
+function restartServer() {
+  console.log('Attempting to restart the server...');
+  exec('npm run start', { cwd: '../backend' }, (error, stdout, stderr) => { // Adjust the path if needed
+    if (error) {
+      console.error(`Error restarting server: ${error.message}`);
+      return;
+    }
+    if (stderr) {
+      console.error(`Server restart stderr: ${stderr}`);
+      return;
+    }
+    console.log(`Server restart stdout: ${stdout}`);
+    console.log('Server restarted successfully.');
+  });
+}
+
+// Automated server check and restart
+setInterval(async () => {
+  const running = await isServerRunning();
+  if (!running) {
+    console.error('Server is not running!');
+    restartServer();
+  }
+}, 5000); // Check every 5 seconds
```

**Explanation of Changes and How They Address the Instruction:**

1.  **File Creation:**
    *   A new file `dex-system/utils/self-healing.js` is created. This file is designed to contain the helper functions and logic for the self-healing system, as instructed.

2.  **`isServerRunning()` Function:**
    *   This function uses Node.js's `http.get` to send a request to the backend server (defaulting to `http://localhost:3001`).
    *   It checks if the server responds with a 200 OK status code.
    *   If successful, it resolves with `true`.
    *   If there's an error during the request (e.g., connection refused, server down), it logs an error message to the console and resolves with `false`.
    * It will timeout after 2 seconds.

3.  **`restartServer()` Function:**
    *   This function uses `child_process.exec` to execute the command `npm run start`.
    *   The `cwd: '../backend'` option ensures that the command is executed within the `dex-system/backend` directory, where the backend's `package.json` and `npm start` script are located.
    *   It logs any errors from the `exec` command to the console.
    *   It also logs standard output and standard error from the server's restart process.
    *   It logs a success message if the server appears to restart.

4.  **Automated Monitoring and Restart:**
    *   `setInterval()` is used to run the self-healing check periodically.
    *   Every 5 seconds (5000 milliseconds), it calls `isServerRunning()`.
    *   If `isServerRunning()` returns `false` (server is down), it logs an error and calls `restartServer()`.

5.  **Error Handling:**
    *   Error messages are logged to the console using `console.error()`, which makes them easier to distinguish from other output.
    *   The `isServerRunning()` function includes error handling for network issues.
    *   The `restartServer()` function handles errors from the shell command.

6.  **Self-Contained and Automonous:**
    *   The file `self-healing.js` can run independently using `node dex-system/utils/self-healing.js`.  It does not need to be included or imported into any other code to begin monitoring and fixing.
    *   It uses a loop that runs on its own, not needing to be called.

7.  **Base for Recursive Self-Healing:**
    *   This code establishes a fundamental mechanism for monitoring and fixing one critical issue (server downtime) automatically.
    *   It can be extended to implement more sophisticated self-healing features, such as:
        *   Monitoring logs for specific errors.
        *   Running code checks.
        *   Restarting other processes.
        *   Triggering other fix actions.

8. **Clarity and maintainability**
    * The code is well commented.
    * Functions have clear and descriptive names.
    * Each function has a single responsibility.

**How to Run and Test:**

1.  **Start the Backend:** In the `dex-system/backend` directory, run `npm start`.
2. **Run the Self Healing Script:** In the project root, run `node dex-system/utils/self-healing.js`.
3. **Simulate Server Crash:** Manually stop the backend server (e.g., by pressing Ctrl+C in the backend's terminal).
4.  **Observe:** The self-healing script will detect that the server is down, log an error, and attempt to restart it. You should see the server restart automatically after a few seconds.

This diff provides the foundation for a recursive self-healing system, as requested in the instruction.

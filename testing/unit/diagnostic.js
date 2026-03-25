/**
 * Simple diagnostic script to test backend connectivity
 */

const http = require('http');

function testEndpoint(method, path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`${method} ${path}`);
        console.log(`  Status: ${res.statusCode}`);
        console.log(`  Headers:`, res.headers);
        try {
          const body = data ? JSON.parse(data) : data;
          console.log(`  Body:`, JSON.stringify(body, null, 2).substring(0, 200));
        } catch (e) {
          console.log(`  Body (raw):`, data.substring(0, 200));
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log(`${method} ${path}`);
      console.log(`  ERROR:`, err.message);
      resolve();
    });

    req.end();
  });
}

async function runDiagnostics() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       BACKEND SERVER DIAGNOSTIC TEST                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Test various endpoints
  await testEndpoint('GET', '/api/health');
  console.log();
  await testEndpoint('POST', '/api/auth/login');
  console.log();
  await testEndpoint('GET', '/api/trainers');
  console.log();
  await testEndpoint('GET', '/');
  console.log();

  console.log('Diagnostic complete.');
}

runDiagnostics().catch(err => {
  console.error('Diagnostic error:', err);
  process.exit(1);
});

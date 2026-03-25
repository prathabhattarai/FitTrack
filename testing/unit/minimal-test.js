/**
 * Minimal test to check login endpoint
 */

const http = require('http');

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const hostname = 'localhost';
    const port = 5000;
    
    console.log(`\nMaking request: ${method} ${path}`);
    console.log(`  To: http://${hostname}:${port}${path}`);

    const options = {
      hostname,
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            body: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data,
          });
        }
      });
    });

    req.on('error', (err) => {
      console.error('Request error:', err.message);
      reject(err);
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  try {
    console.log('TEST 1: Login endpoint');
    let res = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@fittrack.com',
      password: 'admin123'
    });
    console.log(`  Status: ${res.status}`);
    console.log(`  Response:`, JSON.stringify(res.body, null, 2).substring(0, 300));

    console.log('\n\nTEST 2: Trainers endpoint');
    res = await makeRequest('GET', '/api/trainers');
    console.log(`  Status: ${res.status}`);
    console.log(`  Response:`, JSON.stringify(res.body, null, 2).substring(0, 300));

    console.log('\n\nTEST 3: Health endpoint');
    res = await makeRequest('GET', '/api/health');
    console.log(`  Status: ${res.status}`);
    console.log(`  Response:`, JSON.stringify(res.body, null, 2).substring(0, 300));
  } catch (err) {
    console.error('Test    failed:', err.message);
  }
}

test();

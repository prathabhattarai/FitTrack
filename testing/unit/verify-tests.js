const http = require('http');

async function testAttendanceEndpoints() {
  const tests = [
    { method: 'POST', path: '/api/auth/login', body: { email: 'admin@fittrack.com', password: 'admin123' }, desc: 'Admin Login' },
    { method: 'GET', path: '/api/admin/attendance', desc: 'Admin: Get All Attendance' },
    { method: 'GET', path: '/api/admin/attendance/stats', desc: 'Admin: Get Attendance Stats' },
  ];

  for (const test of tests) {
    try {
      const result = await makeReq(test.method, test.path, test.body);
      console.log(`${test.desc}: ${result.status}`);
    } catch (e) {
      console.log(`${test.desc}: ERROR - ${e.message}`);
    }
  }
}

function makeReq(method, path, body) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'localhost', port: 5000, path, method, headers: { 'Content-Type': 'application/json' } };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

testAttendanceEndpoints();

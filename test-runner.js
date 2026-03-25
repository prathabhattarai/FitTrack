const http = require('http');
const fs = require('fs');

let adminToken = '';
let memberToken = '';
let memberId = '';
let testsPassed = 0;
let testsFailed = 0;
const output = [];

function log(msg) {
  output.push(msg);
  process.stdout.write(msg + '\n');
}

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: { error: 'Parse error' } });
        }
      });
    });

    req.on('error', (err) => resolve({ status: 0, body: { error: err.message } }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testResult(name, condition) {
  if (condition) {
    log(`  ✓ ${name}`);
    testsPassed++;
  } else {
    log(`  ✗ ${name}`);
    testsFailed++;
  }
}

async function runTests() {
  log('\n╔════════════════════════════════════════════╗');
  log('║  ADMIN ATTENDANCE TESTS EXECUTION         ║');
  log('╚════════════════════════════════════════════╝\n');

  // Test 1: Admin Login
  log('TEST 1: Authentication');
  let res = await makeRequest('POST', '/api/auth/login', {
    email: 'admin@fittrack.com',
    password: 'admin123'
  });
  await testResult('Admin login returns 200', res.status === 200);
  if (res.status === 200) {
    adminToken = res.body.data?.token;
    await testResult('Admin token received', !!adminToken);
  }

  // Test 2: Member Login
  res = await makeRequest('POST', '/api/auth/login', {
    email: 'pr4tha11.11@gmail.com',
    password: 'password123'
  });
  await testResult('Member login returns 200', res.status === 200);
  if (res.status === 200) {
    memberToken = res.body.data?.token;
    memberId = res.body.data?.userId;
    await testResult('Member token received', !!memberToken);
    await testResult('Member ID received', !!memberId);
  }

  if (!adminToken || !memberToken) {
    log('\n✗ TESTS STOPPED - Authentication failed');
    fs.writeFileSync('test-output.txt', output.join('\n'));
    return;
  }

  // Test 3: Member Check-in
  log('\nTEST 2: Member Check-in (CREATE)');
  res = await makeRequest('POST', '/api/attendance/check-in', {
    workoutType: 'strength',
    notes: 'API test'
  }, memberToken);
  await testResult('Check-in returns 200', res.status === 200);
  let attendanceId = res.body.data?.id;
  await testResult('Attendance ID received', !!attendanceId);

  // Test 4: Admin Get All Attendance
  log('\nTEST 3: Admin Get All Attendance (READ)');
  res = await makeRequest('GET', '/api/admin/attendance', null, adminToken);
  await testResult('GET /admin/attendance returns 200', res.status === 200);
  await testResult('Response is array', Array.isArray(res.body.data));

  // Test 5: Admin Get Member Attendance
  log('\nTEST 4: Admin Get Member Attendance (READ)');
  res = await makeRequest('GET', `/api/admin/attendance/member/${memberId}`, null, adminToken);
  await testResult('GET /admin/attendance/member/:id returns 200', res.status === 200);
  await testResult('Response has records', res.body.data?.records !== undefined);

  // Test 6: Admin Get Stats
  log('\nTEST 5: Admin Get Attendance Stats (READ)');
  res = await makeRequest('GET', '/api/admin/attendance/stats', null, adminToken);
  await testResult('GET /admin/attendance/stats returns 200', res.status === 200);
  await testResult('Response has totalRecords', res.body.data?.totalRecords !== undefined);
  await testResult('Response has uniqueMembers', res.body.data?.uniqueMembers !== undefined);

  // Test 7: Admin Update Attendance
  if (attendanceId) {
    log('\nTEST 6: Admin Update Attendance (UPDATE)');
    res = await makeRequest('PATCH', `/api/admin/attendance/${attendanceId}`, {
      check_out_time: '17:30:00',
      notes: 'Updated'
    }, adminToken);
    await testResult('PATCH /admin/attendance/:id returns 200', res.status === 200);
    await testResult('Updated record returned', res.body.data?.id !== undefined);
  }

  // Test 8: Member Get History
  log('\nTEST 7: Member Get Attendance History (READ)');
  res = await makeRequest('GET', '/api/attendance/history', null, memberToken);
  await testResult('GET /attendance/history returns 200', res.status === 200);
  await testResult('Response is array', Array.isArray(res.body.data));

  // Summary
  log('\n╔════════════════════════════════════════════╗');
  log('║  TEST SUMMARY                             ║');
  log('╚════════════════════════════════════════════╝\n');
  log(`Tests Passed: ${testsPassed}`);
  log(`Tests Failed: ${testsFailed}`);
  log(`Total Tests:  ${testsPassed + testsFailed}`);
  
  if (testsFailed === 0) {
    log('\n✓ ALL TESTS PASSED - Admin Attendance System Working!');
  } else {
    log(`\n✗ ${testsFailed} test(s) failed`);
  }

  // Write to file
  fs.writeFileSync('test-output.txt', output.join('\n'));
  log('\nOutput saved to: test-output.txt');

  process.exit(testsFailed > 0 ? 1 : 0);
}

setTimeout(() => {
  runTests().catch(err => {
    log(`\n✗ Fatal error: ${err.message}`);
    fs.writeFileSync('test-output.txt', output.join('\n'));
    process.exit(1);
  });
}, 500);

#!/usr/bin/env node
const http = require('http');
const fs = require('fs');

const results = {
  timestamp: new Date().toISOString(),
  tests: [],
  summary: {}
};

function req(method, path, body, token) {
  return new Promise((resolve) => {
    const opts = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (token) opts.headers.Authorization = `Bearer ${token}`;
    
    const r = http.request(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, data: d }); }
      });
    });
    r.on('error', e => resolve({ status: 0, error: e.message }));
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

async function test() {
  let adminToken, memberToken, memberId;
  
  // Test 1: Admin Login
  let res = await req('POST', '/api/auth/login', { email: 'admin@fittrack.com', password: 'admin123' });
  results.tests.push({ name: 'Admin Login', status: res.status === 200 ? 'PASS' : 'FAIL', code: res.status });
  if (res.status === 200) adminToken = res.data.data?.token;
  
  // Test 2: Member Login
  res = await req('POST', '/api/auth/login', { email: 'pr4tha11.11@gmail.com', password: 'password123' });
  results.tests.push({ name: 'Member Login', status: res.status === 200 ? 'PASS' : 'FAIL', code: res.status });
  if (res.status === 200) { memberToken = res.data.data?.token; memberId = res.data.data?.userId; }
  
  if (!adminToken || !memberToken) {
    results.summary = { status: 'FAILED', reason: 'Authentication failed', total: results.tests.length, passed: 0, failed: results.tests.length };
    fs.writeFileSync('test-results.json', JSON.stringify(results, null, 2));
    console.log('FAILED: Auth');
    process.exit(1);
  }
  
  // Test 3: Member Check-in
  res = await req('POST', '/api/attendance/check-in', { workoutType: 'test', notes: 'test' }, memberToken);
  results.tests.push({ name: 'Member Check-in', status: res.status === 200 ? 'PASS' : 'FAIL', code: res.status });
  const attendanceId = res.data.data?.id;
  
  // Test 4: Admin Get All Attendance
  res = await req('GET', '/api/admin/attendance', null, adminToken);
  results.tests.push({ name: 'Admin Get All Attendance', status: res.status === 200 ? 'PASS' : 'FAIL', code: res.status });
  
  // Test 5: Admin Get Member Attendance
  res = await req('GET', `/api/admin/attendance/member/${memberId}`, null, adminToken);
  results.tests.push({ name: 'Admin Get Member Attendance', status: res.status === 200 ? 'PASS' : 'FAIL', code: res.status });
  
  // Test 6: Admin Get Stats
  res = await req('GET', '/api/admin/attendance/stats', null, adminToken);
  results.tests.push({ name: 'Admin Get Attendance Stats', status: res.status === 200 ? 'PASS' : 'FAIL', code: res.status });
  
  // Test 7: Admin Update Attendance
  if (attendanceId) {
    res = await req('PATCH', `/api/admin/attendance/${attendanceId}`, { check_out_time: '17:00:00' }, adminToken);
    results.tests.push({ name: 'Admin Update Attendance', status: res.status === 200 ? 'PASS' : 'FAIL', code: res.status });
  }
  
  // Test 8: Member Get History
  res = await req('GET', '/api/attendance/history', null, memberToken);
  results.tests.push({ name: 'Member Get History', status: res.status === 200 ? 'PASS' : 'FAIL', code: res.status });
  
  // Summary
  const passed = results.tests.filter(t => t.status === 'PASS').length;
  const failed = results.tests.filter(t => t.status === 'FAIL').length;
  results.summary = { total: results.tests.length, passed, failed, status: failed === 0 ? 'ALL PASSED' : 'SOME FAILED' };
  
  fs.writeFileSync('test-results.json', JSON.stringify(results, null, 2));
  console.log(`Tests: ${passed}/${results.tests.length} passed`);
  process.exit(failed > 0 ? 1 : 0);
}

test().catch(e => {
  results.summary = { error: e.message };
  fs.writeFileSync('test-results.json', JSON.stringify(results));
  console.error('Test error:', e.message);
  process.exit(1);
});

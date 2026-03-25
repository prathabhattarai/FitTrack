const fs = require('fs');
const http = require('http');

const log = [];

function write(msg) {
  log.push(msg);
  console.log(msg);
}

function req(method, path, body, token) {
  return new Promise((resv) => {
    const opts = { hostname: 'localhost', port: 5000, path, method, headers: { 'Content-Type': 'application/json' } };
    if (token) opts.headers.Authorization = `Bearer ${token}`;
    const r = http.request(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resv({ code: res.statusCode, body: d ? JSON.parse(d) : null }); }
        catch (e) { resv({ code: res.statusCode, body: null, error: e.message }); }
      });
    });
    r.on('error', e => resv({ code: 0, error: e.message }));
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

async function test() {
  write('TEST STARTED\n');
  
  let tok1, tok2, uid;
  
  // Auth
  let r = await req('POST', '/api/auth/login', { email: 'admin@fittrack.com', password: 'admin123' });
  write(`L1: ${r.code}`);
  if (r.code === 200) tok1 = r.body.data?.token;
  
  r = await req('POST', '/api/auth/login', { email: 'pr4tha11.11@gmail.com', password: 'password123' });
  write(`L2: ${r.code}`);
  if (r.code === 200) { tok2 = r.body.data?.token; uid = r.body.data?.userId; }
  
  if (!tok1 || !tok2) { write('AUTH FAILED'); fs.writeFileSync('results.txt', log.join('\n')); process.exit(1); }
  
  // Tests
  r = await req('POST', '/api/attendance/check-in', { workoutType: 'test' }, tok2);
  write(`T1: ${r.code}`);
  let aid = r.body.data?.id;
  
  r = await req('GET', '/api/admin/attendance', null, tok1);
  write(`T2: ${r.code}`);
  
  r = await req('GET', `/api/admin/attendance/member/${uid}`, null, tok1);
  write(`T3: ${r.code}`);
  
  r = await req('GET', '/api/admin/attendance/stats', null, tok1);
  write(`T4: ${r.code}`);
  
  if (aid) {
    r = await req('PATCH', `/api/admin/attendance/${aid}`, { check_out_time: '17:00' }, tok1);
    write(`T5: ${r.code}`);
  }
  
  r = await req('GET', '/api/attendance/history', null, tok2);
  write(`T6: ${r.code}`);
  
  write('\nRESULTS SUMMARY');
  write('Tests completed');
  
  fs.writeFileSync('results.txt', log.join('\n'));
  process.exit(0);
}

test().catch(e => {
  write(`ERROR: ${e.message}`);
  fs.writeFileSync('results.txt', log.join('\n'));
  process.exit(1);
});

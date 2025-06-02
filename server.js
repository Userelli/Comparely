// Polyfill for Object.hasOwn (Node compatibility)
if (typeof Object.hasOwn !== 'function') {
  Object.defineProperty(Object, 'hasOwn', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
  });
}

const express = require('express');
const app = express();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Diff = require('diff');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');
const fs = require('fs').promises;
const path = require('path');
const nlp = require('compromise');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve static files from /public and parse URL-encoded bodies
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Multer config: uploads go to /uploads, 10 MB max each
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });

// versions.json lives in project root alongside server.js
const versionsFile = path.join(__dirname, 'versions.json');

// ────────────────────────────────────────────────────────────────
// Utility functions
// ────────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isOnlyWhitespace(s) {
  return /^[ \t\r\n]+$/.test(s);
}

function containsArabic(s) {
  return /[\u0600-\u06FF]/.test(s);
}

function countTokens(text) {
  if (!text) return 0;
  return containsArabic(text)
    ? text.replace(/\s+/g, '').length
    : text.trim().split(/\s+/).filter(Boolean).length;
}

// Extract plain text from PDF, DOC/DOCX, TXT, and run OCR on images
async function extractText(file) {
  const ext = path.extname(file.originalname).slice(1).toLowerCase();
  try {
    if (ext === 'pdf') {
      const buf = await fs.readFile(file.path);
      return (await pdfParse(buf)).text;
    }
    if (ext === 'doc' || ext === 'docx') {
      return (await mammoth.extractRawText({ path: file.path })).value;
    }
    if (ext === 'txt') {
      return await fs.readFile(file.path, 'utf8');
    }
    if (['jpg', 'jpeg', 'png'].includes(ext)) {
      const { data: { text } } = await Tesseract.recognize(file.path, 'eng');
      return text;
    }
    return '';
  } catch (err) {
    console.error('extractText error:', err);
    return '';
  } finally {
    // Always delete the temp file when done
    await fs.unlink(file.path).catch(() => {});
  }
}

// Estimate semantic “impact” using compromise (noun + verb count)
function semanticImpact(text) {
  const doc = nlp(text);
  return doc.nouns().length + doc.verbs().length;
}

// Ensure versions.json exists; returns parsed array
async function loadVersions() {
  try {
    await fs.writeFile(versionsFile, JSON.stringify([], null, 2), { flag: 'wx' }).catch(() => {});
    return JSON.parse(await fs.readFile(versionsFile, 'utf8'));
  } catch {
    return [];
  }
}

// Append a new version object to versions.json
async function saveVersion(v) {
  const arr = await loadVersions();
  arr.push(v);
  await fs.writeFile(versionsFile, JSON.stringify(arr, null, 2));
}

// Build an HTML diff (no closing </body></html> here; that's added downstream)
function generateDiffHtml(text1, text2) {
  const parts = (containsArabic(text1) || containsArabic(text2))
    ? Diff.diffChars(text1, text2)
    : Diff.diffWordsWithSpace(text1, text2);

  let leftCol = '', rightCol = '';
  const changes = [];
  let insCount = 0, remCount = 0, sid = 0, num = 1;

  parts.forEach(part => {
    // Skip change spans containing only whitespace
    if ((part.added || part.removed) && isOnlyWhitespace(part.value)) {
      return;
    }

    if (part.added) {
      sid++;
      const tk = countTokens(part.value);
      insCount += tk;
      rightCol += `<span id="chg-${sid}" class="added">${escapeHtml(part.value)}</span>`;
      changes.push({
        num: num++,
        type: 'INSERTED',
        txt: part.value.trim(),
        cnt: tk,
        id: sid,
        impact: semanticImpact(part.value)
      });
    } else if (part.removed) {
      sid++;
      const tk = countTokens(part.value);
      remCount += tk;
      leftCol += `<span id="chg-${sid}" class="removed">${escapeHtml(part.value)}</span>`;
      changes.push({
        num: num++,
        type: 'REMOVED',
        txt: part.value.trim(),
        cnt: tk,
        id: sid,
        impact: semanticImpact(part.value)
      });
    } else {
      leftCol += `<span class="unchanged">${escapeHtml(part.value)}</span>`;
      rightCol += `<span class="unchanged">${escapeHtml(part.value)}</span>`;
    }
  });

  const summary = (insCount || remCount)
    ? `Inserted ${insCount} token${insCount !== 1 ? 's' : ''}, Removed ${remCount} token${remCount !== 1 ? 's' : ''}.`
    : 'No changes detected.';

  const changesHtml = changes.map(c => {
    const cls = c.type === 'INSERTED' ? 'ins' : 'rem';
    const sign = c.type === 'INSERTED' ? '+' : '-';
    return `
      <div class="chgblk ${cls}" onclick="scrollTo(${c.id})">
        ${c.num}. ${c.type} (${sign}${c.cnt}, Impact: ${c.impact})<br>
        "${escapeHtml(c.txt)}"
      </div>`;
  }).join('');

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Comparely Diff</title>
    <style>
      body { font-family: Arial; padding: 20px; }
      .added { background: #e5f9e5; }
      .removed { background: #fde2e2; }
      .chgblk { margin: 10px 0; padding: 5px; border-radius: 4px; cursor: pointer; }
      .cols { display: flex; gap: 10px; margin-top: 10px; }
      .col { flex: 1; padding: 10px; border: 1px solid #ccc; white-space: pre-wrap; overflow: auto; max-height: 70vh; }
      .unchanged { background: #fff; }
    </style>
  </head>
  <body>
    <h1>Comparely Diff</h1>
    <div>Summary: ${summary}</div>
    <div class="cols">
      <div class="col">${leftCol}</div>
      <div class="col">${rightCol}</div>
    </div>
    <h2>Changes</h2>
    <div>${changesHtml}</div>
`;
}

// ────────────────────────────────────────────────────────────────
// Route: Compare two uploaded files (POST /compare)
// ────────────────────────────────────────────────────────────────
app.post(
  '/compare',
  upload.fields([{ name: 'file1' }, { name: 'file2' }]),
  async (req, res) => {
    try {
      if (!req.files?.file1?.[0] || !req.files?.file2?.[0]) {
        return res.status(400).send('Both files are required.');
      }

      // Extract text in parallel
      const [t1, t2] = await Promise.all([
        extractText(req.files.file1[0]),
        extractText(req.files.file2[0])
      ]);

      // Quick sanity checks
      if (t1.trim().length < 10 || t2.trim().length < 10) {
        return res.send('Insufficient text to compare.');
      }
      if (t1.length + t2.length > 500_000) {
        return res.status(413).send('Documents too large.');
      }

      // Build diff HTML snippet
      const htmlSnippet = generateDiffHtml(t1, t2);

      // Save version into versions.json
      const versionId = Date.now();
      await saveVersion({ id: versionId, ts: new Date().toISOString(), t1, t2 });

      // Add collaboration invite UI at bottom
      const inviteHtml = `
    <div style="text-align:center; margin-top:20px;">
      <input id="lnk" value="/collab/${versionId}" readonly style="width:60%; padding:5px;" />
      <button id="cpy">Copy</button>
      <button id="eml">Email</button>
    </div>
    <script>
      document.getElementById('cpy')?.addEventListener('click', async () => {
        const link = document.getElementById('lnk').value;
        try { await navigator.clipboard.writeText(link); alert('Copied'); }
        catch { alert('Copy failed'); }
      });
      document.getElementById('eml')?.addEventListener('click', () => {
        const recipient = prompt('Collaborator’s email:');
        if (!recipient) return;
        const subject = encodeURIComponent('Invitation to Collaborate');
        const body = encodeURIComponent('Link: ' + document.getElementById('lnk').value);
        window.location.href = 'mailto:' + recipient + '?subject=' + subject + '&body=' + body;
      });
    </script>
  </body>
</html>`;

      // Send the combined diff+invite HTML back to client
      res.send(htmlSnippet + inviteHtml);
    } catch (err) {
      console.error('Compare error:', err);
      res.status(500).send('Internal server error.');
    }
  }
);

// ────────────────────────────────────────────────────────────────
// Socket.IO for real-time collaboration & comments
// ────────────────────────────────────────────────────────────────
io.on('connection', socket => {
  socket.on('joinRoom', data => socket.join(data.roomId));
  socket.on('collaborationUpdate', data => socket.to(data.roomId).emit('collaborationUpdate', data));
  socket.on('newComment', data => io.emit('broadcastComment', data));
});

// ────────────────────────────────────────────────────────────────
// Start server (static + API) on specified PORT (default 3000)
// ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Comparely listening on port', PORT);
});

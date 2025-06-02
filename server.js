// Polyfill for Object.hasOwn (Node 14 compatibility)
if (typeof Object.hasOwn !== 'function') {
  Object.defineProperty(Object, 'hasOwn', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
  });
}

// Require dependencies and initialize Express app
const express = require('express');
const app = express();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Diff = require('diff');
const mammoth = require('mammoth');           // For DOC/DOCX extraction
const Tesseract = require('tesseract.js');     // For OCR on image files
const fs = require('fs').promises;             // For reading/writing files
const path = require('path');
const nlp = require('compromise');             // For semantic analysis
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve static files and parse form data
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Configure Multer with a 10 MB file‐size limit
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// Path for version history storage
const versionsFile = path.join(__dirname, 'versions.json');

// — Utility Functions —

// Escape HTML special characters in a string
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Returns true if the string is only whitespace (no visible characters)
function isOnlyWhitespace(s) {
  return /^[ \t\r\n]+$/.test(s);
}

// Detect if text contains any Arabic‐script characters
function containsArabic(s) {
  return /[\u0600-\u06FF]/.test(s);
}

// Count “tokens” (words) in a string. For Arabic, count each character instead.
function countTokens(text) {
  if (!text) return 0;
  return containsArabic(text)
    ? text.replace(/\s+/g, '').length
    : text.trim().split(/\s+/).filter(t => t).length;
}

// Extract plain text from uploaded file (PDF, DOC/DOCX, TXT, or image‐OCR)
async function extractText(file) {
  const ext = path.extname(file.originalname).slice(1).toLowerCase();

  try {
    if (ext === 'pdf') {
      // Read PDF buffer, then parse
      const buf = await fs.readFile(file.path);
      return (await pdfParse(buf)).text;
    }
    else if (ext === 'doc' || ext === 'docx') {
      // Use Mammoth to extract raw text from Word docs
      return (await mammoth.extractRawText({ path: file.path })).value;
    }
    else if (ext === 'txt') {
      // Plain‐text files: read directly
      return await fs.readFile(file.path, 'utf8');
    }
    else if (['jpg','jpeg','png'].includes(ext)) {
      // Run Tesseract OCR on image files
      const { data: { text } } = await Tesseract.recognize(file.path, 'eng');
      return text;
    }
    // Unsupported extension => return empty
    return '';
  } catch (err) {
    console.error('✖ extractText error:', err);
    return '';
  } finally {
    // Clean up the uploaded file from disk
    await fs.unlink(file.path).catch(() => {});
  }
}

// Compute a simple “semantic impact” (#nouns + #verbs) using compromise.js
function semanticImpact(text) {
  const doc = nlp(text);
  return doc.nouns().length + doc.verbs().length;
}

// Load the versions.json file into memory (create an empty array if missing)
async function loadVersions() {
  try {
    // If versionsFile doesn't exist, create it with an empty array
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

// Generate side‐by‐side diff HTML for two text blobs (without closing </body></html>)
function generateDiffHtml(text1, text2) {
  // If the text contains Arabic, use diffChars; otherwise diffWordsWithSpace
  const parts = (containsArabic(text1) || containsArabic(text2))
    ? Diff.diffChars(text1, text2)
    : Diff.diffWordsWithSpace(text1, text2);

  let left = '', right = '';
  const changes = [];
  let ins = 0, rem = 0, sid = 0, num = 1;

  parts.forEach(part => {
    // Skip diffs that are purely whitespace
    if ((part.added || part.removed) && isOnlyWhitespace(part.value)) return;

    if (part.added) {
      sid++;
      ins += countTokens(part.value);
      right += `<span id="chg-${sid}" class="added">${escapeHtml(part.value)}</span>`;
      changes.push({
        num: num++,
        type: 'INSERTED',
        txt: part.value.trim(),
        cnt: countTokens(part.value),
        id: sid,
        impact: semanticImpact(part.value)
      });
    }
    else if (part.removed) {
      sid++;
      rem += countTokens(part.value);
      left += `<span id="chg-${sid}" class="removed">${escapeHtml(part.value)}</span>`;
      changes.push({
        num: num++,
        type: 'REMOVED',
        txt: part.value.trim(),
        cnt: countTokens(part.value),
        id: sid,
        impact: semanticImpact(part.value)
      });
    }
    else {
      // Unchanged text
      left += `<span class="unchanged">${escapeHtml(part.value)}</span>`;
      right += `<span class="unchanged">${escapeHtml(part.value)}</span>`;
    }
  });

  // Summary line (inserted/removed token counts)
  const summary = (ins || rem)
    ? `Inserted ${ins} token${ins !== 1 ? 's' : ''}, Removed ${rem} token${rem !== 1 ? 's' : ''}.`
    : 'No changes detected.';

  // Build a “Changes” panel listing each diff chunk
  const changesHtml = changes.map(c => {
    const cls = c.type === 'INSERTED' ? 'ins' : 'rem';
    const sign = c.type === 'INSERTED' ? '+' : '-';
    return `
      <div class="chgblk ${cls}" onclick="scrollTo(${c.id})">
        ${c.num}. ${c.type} (${sign}${c.cnt}, Impact: ${c.impact})<br>"${escapeHtml(c.txt)}"
      </div>
    `;
  }).join('');

  // Return the HTML (without closing </body></html>). The client code appends buttons, etc. below.
  return `
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Comparely Diff</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    .added { background: #e5f9e5; }
    .removed { background: #fde2e2; }
    .chgblk { margin: 10px 0; padding: 5px; border-radius: 4px; cursor: pointer; }
    .cols { display: flex; gap: 10px; }
    .col { flex: 1; padding: 10px; border: 1px solid #ccc; white-space: pre-wrap; overflow: auto; max-height: 70vh; }
  </style>
</head><body>
  <h1>Comparely Diff</h1>
  <div>Summary: ${summary}</div>
  <div class="cols">
    <div class="col">${left}</div>
    <div class="col">${right}</div>
  </div>
  <h2>Changes</h2>
  <div>${changesHtml}</div>
`;
}

// —————————————————————————————————————————————————————————
// Main “compare” route: accepts two files, extracts text, generates diff HTML, saves version
// —————————————————————————————————————————————————————————
app.post(
  '/compare',
  upload.fields([
    { name: 'file1' },
    { name: 'file2' }
  ]),
  async (req, res) => {
    try {
      // Validate both files are present
      if (!req.files?.file1?.[0] || !req.files?.file2?.[0]) {
        return res.status(400).send('Both files are required.');
      }

      // Extract text from each upload
      const t1 = await extractText(req.files.file1[0]);
      const t2 = await extractText(req.files.file2[0]);

      // Simple length checks
      if (t1.trim().length < 10 || t2.trim().length < 10) {
        return res.send('Insufficient text.');
      }
      if (t1.length + t2.length > 500000) {
        return res.status(413).send('Documents too large.');
      }

      // Generate the diff‐HTML snippet
      const html = generateDiffHtml(t1, t2);

      // Save into version history
      const vid = Date.now();
      await saveVersion({
        id: vid,
        ts: new Date().toISOString(),
        t1,
        t2
      });

      // Append “invite” buttons/UI for real‐time collaboration
      const withInv = html +
        `<div style="text-align:center; margin-top:20px;">
           <input id="lnk" value="https://comparely.glitch.me/collab/${vid}" readonly
                  style="width:60%; padding:5px;" />
           <button id="cpy">Copy</button>
           <button id="eml">Email</button>
         </div>
         <script>
           document.getElementById('cpy')?.addEventListener('click', async () => {
             try {
               await navigator.clipboard.writeText(
                 document.getElementById('lnk').value
               );
               alert('Copied');
             } catch {
               alert('Copy failed');
             }
           });
           document.getElementById('eml')?.addEventListener('click', () => {
             const e = prompt('Collaborator\\'s email:');
             if (!e) return;
             const subj = encodeURIComponent('Invitation to Collaborate');
             const body = encodeURIComponent(
               'Link: ' + document.getElementById('lnk').value
             );
             window.location.href = 'mailto:' + e + '?subject=' + subj + '&body=' + body;
           });
         </script>
       </body></html>`;

      res.send(withInv);
    } catch (err) {
      console.error('Compare error:', err);
      res.status(500).send('Internal server error.');
    }
  }
);

// —————————————————————————————————————————————————————————
// Socket.IO: Real‐time collaboration & commenting
// —————————————————————————————————————————————————————————
io.on('connection', socket => {
  socket.on('joinRoom', data => socket.join(data.roomId));
  socket.on('collaborationUpdate', data =>
    socket.to(data.roomId).emit('collaborationUpdate', data)
  );
  socket.on('newComment', data => io.emit('broadcastComment', data));
});

// Start the HTTP + WebSocket server
http.listen(process.env.PORT || 3000, () => {
  console.log('Comparely listening on port', http.address().port);
});

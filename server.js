import express from 'express';
import multer from 'multer';
import mammoth from 'mammoth';
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import Tesseract from 'tesseract.js';
import { diffWordsWithSpace } from 'diff';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/', limits: { fileSize: 20*1024*1024 } });

// real extractText:
async function extractText(file) {
  const ext = path.extname(file.originalname).slice(1).toLowerCase();
  try {
    if (['doc','docx'].includes(ext)) {
      const { value } = await mammoth.extractRawText({ path: file.path });
      return value;
    }
    if (ext === 'pdf') {
      const buf = await fs.readFile(file.path);
      const { text } = await pdfParse(buf);
      return text;
    }
    if (ext === 'txt') {
      return await fs.readFile(file.path, 'utf8');
    }
    if (['jpg','jpeg','png'].includes(ext)) {
      const { data: { text } } = await Tesseract.recognize(file.path, 'eng');
      return text;
    }
    throw new Error('Unsupported extension: ' + ext);
  } finally {
    await fs.unlink(file.path).catch(()=>{});
  }
}

function makeDiff(a,b){
  return diffWordsWithSpace(a,b).map((p,i)=>({
    index:i, added:!!p.added, removed:!!p.removed, value:p.value
  }));
}

app.post('/api/compare',
  upload.fields([{name:'file1',maxCount:1},{name:'file2',maxCount:1}]),
  async (req,res)=>{
    if(!req.files?.file1?.[0]||!req.files?.file2?.[0]){
      return res.status(400).json({error:'Require file1 & file2'});
    }
    const [t1,t2] = await Promise.all([
      extractText(req.files.file1[0]),
      extractText(req.files.file2[0])
    ]);
    console.log('Extracted lengths:',t1.length,t2.length);
    const diff = makeDiff(t1,t2);
    return res.json({ original:t1, modified:t2, diff });
  }
);

app.listen(process.env.PORT||3000,()=>console.log('Running on port',process.env.PORT||3000));

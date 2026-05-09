import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;
const DATA_FILE = join(__dirname, '..', 'data', 'reports.json');

app.use(express.json());

// KST(한국 표준시) 기준 날짜 키 — offsetDays=-1이면 어제, 0이면 오늘
const kstDate = (offsetDays = 0) => {
  const ms = Date.now() + 9 * 3600 * 1000 + offsetDays * 86400 * 1000;
  return new Date(ms).toISOString().slice(0, 10);
};

const dataDir = join(__dirname, '..', 'data');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
const load = () => { try { return JSON.parse(readFileSync(DATA_FILE, 'utf8')); } catch { return []; } };
const save = (d) => { try { writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); } catch {} };

// 학습 완료 보고
app.post('/api/report', (req, res) => {
  const { date, page, lesson, title, score, total, maxCombo } = req.body;
  if (!date || !page) return res.status(400).json({ error: 'date, page 필수' });
  const all = load();
  const r = { date, page, lesson, title, score, total, maxCombo, ts: new Date().toISOString() };
  all.push(r);
  save(all);
  console.log(`📋 ${date} p.${page} ${score}/${total}`);
  res.json({ ok: true });
});

// 마하르발용 현황 조회 — 모든 날짜는 KST 기준
app.get('/api/status', (req, res) => {
  const all = load();
  const today = kstDate(0);
  const td = all.filter(r => r.date === today);
  const days = [...new Set(all.map(r => r.date))];
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    if (all.some(r => r.date === kstDate(-i))) streak++; else break;
  }
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const ds = kstDate(-i);
    week.push({ date: ds, count: all.filter(r => r.date === ds).length });
  }
  res.json({
    today: { date: today, count: td.length, pages: td.map(r => ({ p: r.page, s: r.score, t: r.total })) },
    summary: { totalReports: all.length, totalDays: days.length, streak },
    week, last: all[all.length - 1] || null
  });
});

app.use(express.static(join(__dirname, '..', 'dist')));
app.get('*', (req, res) => res.sendFile(join(__dirname, '..', 'dist', 'index.html')));
app.listen(PORT, () => console.log(`스텔라 서버: ${PORT} | 마하르발: /api/status`));

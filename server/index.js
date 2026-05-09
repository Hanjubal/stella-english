import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// 정적 파일 서빙 (Vite 빌드 결과)
app.use(express.static(join(__dirname, '..', 'dist')));

// SPA 라우팅 — 모든 경로를 index.html로
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`스텔라 영어 따라치기 서버 실행 중: http://localhost:${PORT}`);
});

# 일기 앱 + AI 자아 리포트

## 프로젝트 구조
```
journal-app/
├── backend/
│   ├── models/
│   │   ├── User.js       # 유저 스키마
│   │   └── Entry.js      # 일기 스키마
│   ├── routes/
│   │   ├── auth.js       # 로그인/회원가입
│   │   ├── entries.js    # 일기 CRUD + 친구 피드
│   │   ├── questions.js  # AI 질문 생성
│   │   ├── report.js     # AI 자아 리포트 생성
│   │   └── friends.js    # 친구 추가/검색
│   ├── middleware/
│   │   └── auth.js       # JWT 인증
│   └── server.js
└── frontend/
    └── src/
        ├── api/index.js  # API 호출 함수 모음
        ├── pages/
        │   ├── Home.jsx    # 홈 (오늘 질문 + 친구 피드)
        │   ├── Write.jsx   # 일기 작성
        │   ├── Album.jsx   # 내 기록 앨범
        │   ├── Report.jsx  # AI 자아 리포트
        │   └── Login.jsx   # 로그인/회원가입
        └── App.jsx         # 라우팅

## 시작하기

### 백엔드
```bash
cd backend
cp .env.example .env   # .env 파일 만들고 키 채우기
npm install
npm run dev
```

### 프론트엔드
```bash
cd frontend
npm install
npm run dev
```

## API 명세

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/auth/register | 회원가입 |
| POST | /api/auth/login | 로그인 |
| GET | /api/questions/today | 오늘의 AI 질문 |
| POST | /api/entries | 일기 작성 |
| GET | /api/entries/mine | 내 일기 전체 |
| GET | /api/entries/friends-feed | 친구 피드 |
| POST | /api/entries/:id/react | 리액션 |
| GET | /api/report/generate | AI 자아 리포트 생성 |
| GET | /api/friends/search | 친구 검색 |
| POST | /api/friends/add/:id | 친구 추가 |

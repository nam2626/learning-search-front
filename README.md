# 학습 자료 검색 프론트엔드

백엔드 Spring Boot REST API를 사용하는 학습 자료 검색 프론트엔드 애플리케이션입니다.

## 기술 스택

- **React 18** + **TypeScript**
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Axios** - HTTP 클라이언트
- **React Query** - 서버 상태 관리
- **React Router v6** - 라우팅

## 주요 기능

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 검색 (홈) | `/` | 자연어 질문으로 학습 자료 검색 |
| 업로드 | `/upload` | PDF/TXT 문서 드래그 앤 드롭 업로드 |
| 로그인 | `/login` | 이메일/비밀번호 로그인 |
| 회원가입 | `/register` | 이메일/비밀번호/닉네임 회원가입 |

## 프로젝트 구조

```
src/
├── api/                    # API 클라이언트
│   ├── client.ts           # Axios 인스턴스 (인터셉터 포함)
│   ├── auth.ts             # 인증 API
│   ├── documents.ts        # 문서 업로드 API
│   └── search.ts           # 검색 API
├── components/             # 컴포넌트
│   ├── common/             # 공통 컴포넌트
│   │   ├── Header.tsx      # 네비게이션 헤더
│   │   └── Layout.tsx      # 공통 레이아웃
│   ├── auth/               # 인증 관련
│   │   ├── LoginForm.tsx   # 로그인 폼
│   │   └── RegisterForm.tsx# 회원가입 폼
│   ├── search/             # 검색 관련
│   │   ├── SearchBar.tsx   # 검색 입력창
│   │   └── SearchResult.tsx# 검색 결과 표시
│   └── upload/             # 업로드 관련
│       └── FileUpload.tsx  # 파일 업로드 (드래그 앤 드롭)
├── contexts/               # React Context
│   └── AuthContext.tsx     # 인증 상태 관리
├── hooks/                  # 커스텀 훅
│   ├── useSearch.ts        # 검색 훅
│   └── useUpload.ts        # 업로드 훅
├── pages/                  # 페이지 컴포넌트
│   ├── HomePage.tsx        # 메인 검색 페이지
│   ├── LoginPage.tsx       # 로그인 페이지
│   ├── RegisterPage.tsx    # 회원가입 페이지
│   └── UploadPage.tsx      # 업로드 페이지
├── types/                  # TypeScript 타입 정의
│   └── index.ts
├── App.tsx                 # 라우터 설정
├── main.tsx                # 엔트리 포인트
└── index.css               # Tailwind 설정
```

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

## 백엔드 API

백엔드 서버: `https://nam3324.synology.me:32902`

| 기능 | 메서드 | 경로 |
|------|--------|------|
| 회원가입 | POST | `/api/auth/register` |
| 로그인 | POST | `/api/auth/login` |
| 로그아웃 | POST | `/api/auth/logout` |
| 회원탈퇴 | DELETE | `/api/auth/delete` |
| 문서 업로드 | POST | `/api/documents/upload` |
| 검색 | GET | `/api/search?query=` |

## 환경 설정

API 서버 URL은 [src/api/client.ts](src/api/client.ts)에서 변경할 수 있습니다:

```typescript
const API_BASE_URL = 'https://nam3324.synology.me:32902';
```

# 🔐 Aura Gallery 관리자 시스템 설정 가이드

> 백엔드 개발 경험이 없어도 따라할 수 있는 단계별 가이드입니다.

---

## 📌 전체 구조 이해하기

```
┌─────────────────────────────────────────────────────────────┐
│                    Aura Gallery 시스템                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [사용자 브라우저]                                            │
│       │                                                     │
│       ▼                                                     │
│  [Next.js 앱] ◄──────► [Vercel Postgres DB]                 │
│       │                    (프로젝트/사용자 정보 저장)          │
│       │                                                     │
│       └──────────────► [Vercel Blob Storage]                │
│                           (이미지 파일 저장)                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 💡 핵심 개념 설명

| 용어 | 쉬운 설명 |
|------|----------|
| **Next.js** | 웹사이트를 만드는 도구 (프레임워크) |
| **Prisma** | 데이터베이스와 대화하는 통역사 (ORM) |
| **NextAuth** | 로그인/로그아웃을 담당하는 보안관 |
| **Vercel Postgres** | 프로젝트 정보를 저장하는 온라인 창고 (데이터베이스) |
| **Vercel Blob** | 이미지 파일을 저장하는 온라인 창고 (파일 저장소) |

---

## 🚀 설정 과정 (순서대로 따라하기)

### Phase 1: Vercel 스토리지 연결

#### 1-1. Vercel CLI 설치 및 로그인
```bash
# Vercel CLI 설치
npm install -g vercel

# Vercel 계정 로그인
vercel login
```

#### 1-2. 프로젝트 연결
```bash
# 프로젝트 폴더에서 실행
vercel link
```
📝 **무슨 일이 일어났나요?**  
로컬 프로젝트와 Vercel 클라우드가 연결되었습니다.

#### 1-3. Postgres 데이터베이스 생성
```bash
# 데이터베이스 생성 및 연결
vercel storage create postgres gallery-db
```
📝 **무슨 일이 일어났나요?**  
클라우드에 데이터베이스가 만들어지고, 연결 정보가 자동으로 설정되었습니다.

#### 1-4. Blob 스토리지 생성
```bash
# 이미지 저장소 생성 및 연결
vercel storage create blob gallery-images
```
📝 **무슨 일이 일어났나요?**  
이미지 파일을 저장할 클라우드 공간이 만들어졌습니다.

#### 1-5. 환경 변수 가져오기
```bash
# 연결 정보를 로컬로 가져오기
vercel env pull .env.local
```
📝 **무슨 일이 일어났나요?**  
데이터베이스/스토리지 접속 정보가 `.env.local` 파일에 저장되었습니다.

---

### Phase 2: 데이터베이스 설정

#### 2-1. Prisma 스키마 작성
`prisma/schema.prisma` 파일에서 데이터 구조를 정의합니다:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      String   @default("ADMIN")
}

model Project {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  category    String
  year        Int
  thumbnail   String?
  description String?
  published   Boolean  @default(true)
  images      Image[]
}

model Image {
  id        String   @id @default(cuid())
  url       String
  alt       String?
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
}
```

📝 **무슨 일이 일어났나요?**  
데이터베이스에 저장할 정보의 "설계도"를 작성했습니다.

#### 2-2. 데이터베이스에 적용
```bash
# 스키마를 실제 데이터베이스에 적용
npx prisma db push
```
📝 **무슨 일이 일어났나요?**  
설계도대로 데이터베이스 테이블이 생성되었습니다.

#### 2-3. 관리자 계정 생성 (Seed)
```bash
# 초기 관리자 계정 및 샘플 데이터 생성
npx prisma db seed
```
📝 **무슨 일이 일어났나요?**  
`prisma/seed.ts` 파일의 내용대로 초기 데이터가 생성되었습니다.

**기본 관리자 계정:**
- 📧 이메일: `admin@aura.gallery`
- 🔑 비밀번호: `admin123`

---

### Phase 3: 인증 시스템 (NextAuth)

#### 3-1. NextAuth 설정
`src/lib/auth.ts` 파일이 로그인 로직을 담당합니다:

```typescript
// 간략화된 구조
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // 1. 이메일로 사용자 찾기
        // 2. 비밀번호 확인
        // 3. 성공시 사용자 정보 반환
      },
    }),
  ],
});
```

#### 3-2. 보호된 페이지 설정
`src/middleware.ts`가 관리자 페이지를 보호합니다:
- `/admin/*` 경로는 로그인 필요
- 로그인 안 했으면 `/admin/login`으로 이동

---

### Phase 4: 관리자 페이지

#### 페이지 구조
```
src/app/admin/
├── login/page.tsx      # 로그인 페이지
├── page.tsx            # 대시보드 (통계 표시)
└── projects/
    ├── page.tsx        # 프로젝트 목록
    ├── new/page.tsx    # 새 프로젝트 생성
    └── [id]/
        └── edit/page.tsx  # 프로젝트 수정
```

#### API 엔드포인트
```
src/app/api/
├── auth/[...nextauth]/ # 인증 API
├── projects/           # 프로젝트 CRUD
│   ├── route.ts        # GET(목록), POST(생성)
│   └── [id]/route.ts   # GET/PUT/DELETE(개별)
└── upload/route.ts     # 이미지 업로드
```

---

## 🧪 테스트 방법

### 개발 서버 실행
```bash
npm run dev
```

### 관리자 페이지 접속
1. 브라우저에서 `http://localhost:3000/admin/login` 접속
2. 이메일: `admin@aura.gallery`
3. 비밀번호: `admin123`
4. 로그인 후 대시보드에서 프로젝트 관리

---

## ❓ 자주 묻는 질문

### Q: 관리자 비밀번호를 바꾸고 싶어요
`prisma/seed.ts` 파일에서 `adminPassword` 값을 변경한 후:
```bash
# 기존 데이터 삭제 후 재생성 필요
npx prisma db push --force-reset
npx prisma db seed
```

### Q: 새 관리자를 추가하고 싶어요
`prisma/seed.ts`에 새 사용자 생성 코드를 추가하거나, Prisma Studio를 사용:
```bash
npx prisma studio
```
브라우저에서 User 테이블에 직접 추가할 수 있습니다.

### Q: 데이터베이스 내용을 확인하고 싶어요
```bash
npx prisma studio
```
브라우저에서 모든 테이블과 데이터를 시각적으로 확인할 수 있습니다.

---

## 📁 주요 파일 목록

| 파일 | 역할 |
|------|------|
| `prisma/schema.prisma` | 데이터베이스 구조 정의 |
| `prisma/seed.ts` | 초기 데이터 생성 스크립트 |
| `src/lib/auth.ts` | 인증 로직 |
| `src/lib/prisma.ts` | 데이터베이스 연결 |
| `src/middleware.ts` | 페이지 접근 제어 |
| `.env.local` | 환경 변수 (비밀 정보) |

---

*마지막 업데이트: 2025-12-28*

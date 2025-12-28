🤖 [AI Agent Instruction] High-End Gallery Project: "Aura"
목적: 에이전트는 이 명세를 바탕으로 기술적 완성도, 가독성 높은 코드, 그리고 웹 접근성을 모두 갖춘 갤러리 웹사이트를 구축한다.

🛠️ 1. 기술 스택 및 라이브러리 (Tech Stack)
Framework: Next.js 14+ (App Router), TypeScript

UI Library: shadcn/ui (반드시 shadcn MCP 서버를 호출하여 컴포넌트 추가)

Animation: Framer Motion, GSAP

Styling: Tailwind CSS

Accessibility: axe-core, react-aria

Database: Prisma ORM + Vercel Postgres (Neon Adapter)

Storage: Vercel Blob

Authentication: NextAuth.js v5 (Credentials Provider)

💻 2. 코딩 주의사항 (Coding Guidelines)
에이전트는 코드 작성 시 다음의 품질 기준을 반드시 준수한다.

가독성 최우선 (Readability): * 명확한 변수명과 함수명을 사용한다. (예: data 대신 artworkList, handle 대신 onImageClick)

컴포넌트는 기능별로 적절히 분리하여 한 파일이 너무 길어지지 않게 한다.

중복 제거 (DRY - Don't Repeat Yourself):

반복되는 UI 패턴은 공통 컴포넌트로 추출한다.

동일한 애니메이션 설정은 변수(Variants)로 관리하여 재사용한다.

간결한 주석 (Clean Comments):

코드를 그대로 설명하는 불필요한 주석은 지양한다.

복잡한 비즈니스 로직이나 인터랙션의 '의도'가 필요한 부분에만 명확한 주석을 남긴다.

타입 안정성 (Type Safety): * any 사용을 금지하며, 인터페이스와 타입을 명확히 정의한다.

최적화 (Optimization):

불필요한 리렌더링을 방지하고, Next.js의 Image 컴포넌트 옵션을 적절히 설정한다.

🎨 3. 디자인 레퍼런스 (Design References)
Main Visual/Layout: https://jiii-atelier.com/works

Interaction/Motion: https://www.bittercreek.studio/studio

Typography/Tone: DM Serif Display, High-end tone

🚀 4. 단계별 작업 순서 (Work Process)
Phase 1: 기반 구축 - Next.js 세팅 및 shadcn MCP 연동, 테마 설정.

Phase 2: 핵심 컴포넌트 - 가독성 있는 코드로 GalleryGrid, ImageCard 개발.

Phase 3: 인터랙션 - Framer Motion을 활용한 스태거 및 호버 효과 적용.

Phase 4: 상세 페이지 - 이미지와 텍스트의 조화를 고려한 레이아웃 및 스크롤 애니메이션.

Phase 5: 접근성 및 검수 - 키보드 네비게이션 및 스크린 리더 대응.

Phase 6: 관리자 시스템 - CMS 백엔드 구축 (아래 상세 설명)

♿ 5. 웹 접근성 준수 체크리스트 (A11y Audit)
[ ] Semantic HTML: 의미에 맞는 HTML 태그 사용 여부.

[ ] Keyboard Navigation: 모든 요소의 키보드 접근 및 포커스 관리.

[ ] Color Contrast: 텍스트 대비 4.5:1 이상 유지.

[ ] ARIA Labels: 인터랙티브 요소에 적절한 ARIA 레이블 부여.

---

🔐 6. 관리자 시스템 구축 (Admin CMS Setup)

### 6-1. 인프라 설정 (Vercel Storage)
```bash
# 1. Vercel CLI 설치 및 로그인
npm install -g vercel
vercel login

# 2. 프로젝트 연결
vercel link

# 3. Postgres 데이터베이스 생성
vercel storage create postgres <db-name>

# 4. Blob 스토리지 생성
vercel storage create blob <storage-name>

# 5. 환경 변수 동기화
vercel env pull .env.local
```

### 6-2. Prisma 설정 (Database ORM)
```bash
# 1. 필요한 패키지 설치
npm install prisma @prisma/client @prisma/adapter-neon @neondatabase/serverless

# 2. Prisma 초기화
npx prisma init

# 3. prisma/schema.prisma 작성 (User, Project, Image 모델)
# 4. prisma.config.ts 생성 (Neon adapter 설정)

# 5. 데이터베이스에 스키마 적용
npx prisma db push

# 6. 초기 데이터 생성
npx prisma db seed
```

### 6-3. 인증 시스템 (NextAuth.js v5)
```bash
# 1. 패키지 설치
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs

# 2. 설정 파일 생성
# - src/lib/auth.ts (NextAuth 설정)
# - src/types/next-auth.d.ts (타입 확장)
# - src/app/api/auth/[...nextauth]/route.ts (API 라우트)

# 3. AUTH_SECRET 환경 변수 설정
npx auth secret
```

### 6-4. 관리자 페이지 구조
```
src/app/admin/
├── layout.tsx          # 관리자 레이아웃
├── page.tsx            # 대시보드
├── login/page.tsx      # 로그인
└── projects/
    ├── page.tsx        # 프로젝트 목록
    ├── new/page.tsx    # 생성
    └── [id]/edit/page.tsx  # 수정
```

### 6-5. API 엔드포인트
```
src/app/api/
├── auth/[...nextauth]/ # 인증
├── projects/           # 프로젝트 CRUD
└── upload/             # 이미지 업로드 (Vercel Blob)
```

---

🧪 7. 테스트 및 디버깅 (Testing & Debugging)

### 7-1. 개발 서버 실행
```bash
npm run dev
```

### 7-2. 일반적인 오류 해결

#### 권한 오류 (EPERM, Permission denied)
- **원인**: 파일이 다른 프로세스에서 사용 중
- **해결**: 
  ```bash
  # 1. 모든 node 프로세스 종료
  taskkill /f /im node.exe
  
  # 2. IDE를 관리자 권한으로 실행
  ```

#### 데이터베이스 연결 오류
- **원인**: 환경 변수 미설정
- **해결**:
  ```bash
  # 환경 변수 재동기화
  vercel env pull .env.local
  ```

#### Prisma 스키마 오류
- **해결**:
  ```bash
  # 클라이언트 재생성
  npx prisma generate
  
  # 스키마 재적용
  npx prisma db push
  ```

### 7-3. 브라우저 테스트
1. `http://localhost:3000` - 메인 갤러리
2. `http://localhost:3000/admin/login` - 관리자 로그인
3. 기본 계정: `admin@aura.gallery` / `admin123`

### 7-4. 데이터베이스 확인
```bash
npx prisma studio
```

---

🏁 8. 완료 정의 (Definition of Done)
사용자의 디자인 레퍼런스 감도를 충실히 재현했는가?

중복 없이 깔끔하고 읽기 쉬운 코드로 작성되었는가?

웹 접근성 검수 도구에서 결함이 발견되지 않는가?

모든 해상도에서 이미지와 설명 텍스트의 가독성이 훌륭한가?

관리자 시스템이 정상 작동하는가? (로그인, CRUD, 이미지 업로드)

---

📋 9. 프로젝트 파일 구조 (Project Structure)
```
new-gallery-app/
├── prisma/
│   ├── schema.prisma      # DB 스키마
│   └── seed.ts            # 초기 데이터
├── prisma.config.ts       # Prisma 설정
├── src/
│   ├── app/
│   │   ├── admin/         # 관리자 페이지
│   │   ├── api/           # API 라우트
│   │   └── (gallery)/     # 갤러리 페이지
│   ├── components/        # 공통 컴포넌트
│   ├── lib/
│   │   ├── auth.ts        # 인증 설정
│   │   └── prisma.ts      # DB 연결
│   └── types/             # 타입 정의
├── docs/
│   └── ADMIN_SETUP_GUIDE.md  # 관리자 설정 가이드
└── .env.local             # 환경 변수 (git 제외)
```

---

*마지막 업데이트: 2025-12-28*
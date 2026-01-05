# Troubleshooting Log: 2026-01-05

## 개요

이 문서는 2026년 1월 5일에 수행된 관리자 페이지 트러블슈팅 과정을 기록합니다.

---

## 발견된 문제

### 문제 1: 프로젝트 생성 실패 (400 Bad Request)

**증상:**
```
POST /api/projects 400
Error: "Missing required fields"
```

**원인:**
- API(`src/app/api/projects/route.ts`)에서 `thumbnail`을 필수 필드로 요구
- UI(`src/app/admin/projects/new/page.tsx`)에서는 "(optional)"로 표시
- 사용자가 thumbnail 없이 프로젝트 생성 시도 시 실패

**해결:**
```typescript
// 수정 전
if (!title || !slug || !category || !year || !thumbnail || !description) {
    return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
    );
}

// 수정 후
const missingFields: string[] = [];
if (!title) missingFields.push("title");
if (!slug) missingFields.push("slug");
if (!category) missingFields.push("category");
if (!year) missingFields.push("year");
if (!description) missingFields.push("description");

if (missingFields.length > 0) {
    return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
    );
}

// thumbnail이 없으면 첫 번째 이미지 사용
const finalThumbnail = thumbnail || images?.[0]?.url || "";
```

---

### 문제 2: 프로젝트 생성/수정 실패 (500 Internal Server Error)

**증상:**
```
POST /api/projects 500
PUT /api/projects/[id] 500
prisma:error Connection terminated unexpectedly
TypeError: The "string" argument must be of type string or an instance of Buffer or ArrayBuffer. Received an instance of Object
```

**원인:**
- Prisma 7.x와 `@neondatabase/serverless` 패키지의 호환성 문제
- Neon serverless 드라이버는 Edge Runtime(Vercel Edge Functions)용으로 설계됨
- 로컬 Node.js 환경에서 Buffer 처리 방식과 충돌

**디버깅 과정:**

1. **fetch 모드 시도** (`poolQueryViaFetch = true`)
   - 결과: 동일한 Buffer 타입 에러 발생
   
2. **WebSocket 모드 시도** (`ws` 패키지 설치)
   - 결과: "Connection terminated unexpectedly" 에러 발생
   
3. **Prisma 설정 변경 시도**
   - `prisma.config.ts`에서 `directUrl` 설정
   - 결과: Prisma 7.x에서 adapter 필수 요구

**최종 해결:**

Prisma 7.2.0 → 6.19.1 다운그레이드

```bash
# 1. Neon 관련 패키지 제거
npm uninstall @prisma/adapter-neon @neondatabase/serverless ws @types/ws

# 2. Prisma 6.x 설치
npm install prisma@6 @prisma/client@6

# 3. prisma.config.ts 삭제 (Prisma 7 전용 파일)
del prisma.config.ts

# 4. Prisma 클라이언트 재생성
npx prisma generate
```

**수정된 파일:**

`src/lib/prisma.ts`:
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
    return new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
```

`prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}
```

---

## 패키지 변경 내역

### 제거된 패키지
| 패키지 | 버전 | 이유 |
|--------|------|------|
| `@prisma/adapter-neon` | 7.2.0 | Prisma 6.x에서 불필요 |
| `@neondatabase/serverless` | 1.0.2 | Node.js 호환성 문제 |
| `ws` | 8.18.3 | Neon adapter 의존성 |
| `@types/ws` | 8.18.1 | ws 타입 정의 |

### 변경된 패키지
| 패키지 | 이전 | 이후 |
|--------|------|------|
| `prisma` | 7.2.0 | 6.19.1 |
| `@prisma/client` | 7.2.0 | 6.19.1 |

---

## 검증 결과

### 테스트 1: 프로젝트 생성
- **입력:** Title: "Prisma 6 Test", Category: "Final Test"
- **결과:** ✅ 성공 - 프로젝트 목록으로 리다이렉트

### 테스트 2: 프로젝트 수정
- **작업:** Category를 "Successfully Fixed"로 변경
- **결과:** ✅ 성공 - 변경사항 저장 및 리다이렉트

### 테스트 3: 프로젝트 목록
- **결과:** ✅ 성공 - 4개 프로젝트 표시 (새로 생성한 1개 포함)

---

## 향후 권장 사항

1. **Vercel 배포 시**: Prisma 6.x는 Neon과 직접 연결 가능하므로 동일 설정 유지
2. **Prisma 7 마이그레이션**: Edge Runtime 필요 시에만 Neon adapter 사용 고려
3. **환경 분리**: 로컬 개발용 PostgreSQL 인스턴스 사용 고려

---

## 참고 자료

- [Prisma with Neon](https://www.prisma.io/docs/guides/database/neon)
- [Neon Serverless Driver](https://neon.tech/docs/serverless/serverless-driver)
- [Prisma 6.x Migration Guide](https://www.prisma.io/docs/guides/upgrade-guides/upgrading-versions)

---

*작성일: 2026-01-05*

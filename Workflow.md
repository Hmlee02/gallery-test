🤖 [AI Agent Instruction] High-End Gallery Project: "Aura"
목적: 에이전트는 이 명세를 바탕으로 기술적 완성도, 가독성 높은 코드, 그리고 웹 접근성을 모두 갖춘 갤러리 웹사이트를 구축한다.

🛠️ 1. 기술 스택 및 라이브러리 (Tech Stack)
Framework: Next.js 14+ (App Router), TypeScript

UI Library: shadcn/ui (반드시 shadcn MCP 서버를 호출하여 컴포넌트 추가)

Animation: Framer Motion, GSAP

Styling: Tailwind CSS

Accessibility: axe-core, react-aria

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

♿ 5. 웹 접근성 준수 체크리스트 (A11y Audit)
[ ] Semantic HTML: 의미에 맞는 HTML 태그 사용 여부.

[ ] Keyboard Navigation: 모든 요소의 키보드 접근 및 포커스 관리.

[ ] Color Contrast: 텍스트 대비 4.5:1 이상 유지.

[ ] ARIA Labels: 인터랙티브 요소에 적절한 ARIA 레이블 부여.

🏁 6. 완료 정의 (Definition of Done)
사용자의 디자인 레퍼런스 감도를 충실히 재현했는가?

중복 없이 깔끔하고 읽기 쉬운 코드로 작성되었는가?

웹 접근성 검수 도구에서 결함이 발견되지 않는가?

모든 해상도에서 이미지와 설명 텍스트의 가독성이 훌륭한가?
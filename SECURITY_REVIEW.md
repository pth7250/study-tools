# 보안 검토 및 강화 결과

## 범위와 현재 구조

검토 대상은 현재 Git 작업본 전체와 현재 GitHub Pages 배포 경로입니다. 이 프로젝트는 Vite와 Vanilla JavaScript로 만든 정적 멀티페이지 웹사이트입니다. `src/pages`의 HTML과 `public` 자산만 `dist`로 빌드되어 GitHub Pages에 배포됩니다.

- 백엔드, 데이터베이스, 사용자 계정, 관리자 기능, 서버 API가 없습니다.
- 로그인, 세션, 쿠키 인증, JWT, 비밀번호, 파일 업로드, 서버 파일 접근, 리디렉션 처리, 서버 로그가 없습니다.
- 사용자 입력은 브라우저에서 계산되며, 영속 저장은 탭 선택값 `studytools-tab` 하나뿐입니다. 점수·일정·생기부 텍스트는 저장하거나 전송하지 않습니다.
- 현행 서비스에서 API 인증·인가, IDOR, CSRF, SQL/NoSQL injection, SSRF, path traversal, mass assignment, API rate limiting은 적용 대상이 없습니다. 이러한 기능을 추후 추가할 때는 별도 서버 측 보안 설계와 검증이 필요합니다.

## 발견된 취약점

### 낮음 — GitHub Actions 공급망 무결성 및 과도한 작업 권한

원래 배포 워크플로는 `actions/checkout`, `actions/setup-node`, `actions/upload-pages-artifact`, `actions/deploy-pages`를 변경 가능한 `@vN` 태그로 참조했습니다. 또한 `pages: write`와 `id-token: write` 권한이 workflow 전체에 부여되어 빌드 단계의 외부 액션도 배포 권한을 상속받았습니다.

공격 전제는 공식 GitHub Action 태그 또는 해당 공급망이 변조되는 경우입니다. 이 전제가 성립하면 배포 권한을 지닌 워크플로에서 변경된 외부 코드를 실행할 수 있으므로 공개 GitHub Pages 산출물의 무결성에 영향을 줄 수 있습니다. `main` push와 수동 실행만 트리거하므로 비신뢰 PR이 바로 실행되는 구조는 아니며, 이 점을 반영해 심각도는 낮음으로 분류했습니다. 관련 CWE는 CWE-829입니다.

## 적용한 수정

### CI/CD 공급망과 권한

- 모든 GitHub Action 참조를 검증한 불변 커밋 SHA로 고정했습니다.
- `build` 작업에는 `contents: read`만 부여했습니다.
- `deploy` 작업에만 `pages: write`와 `id-token: write`를 부여했습니다.
- npm과 GitHub Actions의 업데이트 PR을 주기적으로 생성하도록 Dependabot 설정을 추가했습니다.

### XSS와 클라이언트 입력 처리

- 동적 과목 입력 행 생성에서 `innerHTML` 사용을 제거했습니다. 모든 요소·속성·텍스트는 DOM API와 `textContent`로 생성합니다.
- 기존 결과 출력은 계속 `textContent`만 사용합니다. 사용자 입력을 HTML, URL, 스크립트로 보간하는 경로는 확인되지 않았습니다.
- 탭 복원 시 동적 CSS selector 조합을 제거하고, 이미 존재하는 패널 목록에서 정확한 ID를 비교하도록 바꿨습니다.
- 동적으로 추가되는 과목명 입력은 100자로 제한했습니다.

### 브라우저 정책

- 15개 현재 서비스 페이지의 CSP에서 `style-src 'unsafe-inline'`을 제거했습니다.
- 인라인 스타일 속성을 CSS 클래스로 옮겼습니다.
- CSP에 `object-src 'none'`, `frame-src 'none'`, `media-src 'none'`, `worker-src 'none'`, `font-src 'self'`, `manifest-src 'self'`를 추가했습니다.
- 외부 연결이 없는 현재 구현과 호환되도록 `script-src`, `style-src`, `connect-src`는 same-origin으로 제한했습니다.
- 모든 현재 페이지에 `strict-origin-when-cross-origin` referrer 정책 메타 태그를 추가했습니다.

### 비밀값과 의존성

- 코드, 워크플로, 압축 보관물의 텍스트 항목을 대상으로 API key, secret, password, authorization, token, private key 계열의 흔적을 값 노출 없이 검사했습니다. 발견된 추적 파일은 없습니다.
- 추적된 `.env` 파일은 없었습니다.
- `.gitignore`에 `.env`, `.env.*`를 추가하고 `.env.example`은 예외로 두었습니다.
- `npm audit --json`과 `npm ci` 감사 결과는 취약점 0건입니다.

## OWASP 항목별 판정

| 항목 | 결과 | 근거 또는 조치 |
| --- | --- | --- |
| XSS | 강화 완료 | 사용자 출력은 `textContent`를 사용하며 동적 `innerHTML`을 제거했습니다. |
| SQL/NoSQL injection | 해당 없음 | 서버·DB·쿼리 계층이 없습니다. |
| 인증·세션·JWT·brute force | 해당 없음 | 계정, 로그인, 쿠키 인증, JWT가 없습니다. |
| IDOR·관리자 권한 | 해당 없음 | 사용자별 또는 관리자 API와 데이터가 없습니다. |
| CSRF·CORS·API schema/body/method | 해당 없음 | 쿠키 기반 서버 API와 교차 출처 API가 없습니다. |
| API/AI 비용 rate limit | 해당 없음 | 네트워크 API 또는 비용 발생 호출이 없습니다. |
| 파일 업로드·path traversal·SSRF·open redirect | 해당 없음 | 업로드, 서버 파일 처리, 사용자 URL fetch, 서버 redirect가 없습니다. |
| Prototype pollution/object injection | 문제 없음 | 사용자 객체 merge나 동적 속성 할당이 없습니다. |
| 오류·로그 민감정보 | 문제 없음 | 서버 오류·로그 계층과 비밀값 처리 경로가 없습니다. |
| 프런트엔드 비밀값·localStorage | 문제 없음 | API key가 없고, localStorage에는 탭 이름만 저장합니다. |
| CSP·Referrer 정책 | 강화 완료 | 모든 현재 정적 페이지 정책을 강화했습니다. |
| GitHub Actions 공급망 | 수정 완료 | SHA pinning, 작업별 최소 권한, Dependabot을 적용했습니다. |

## 검증 결과

| 검증 | 결과 |
| --- | --- |
| `npm audit --json` | 취약점 0건 |
| `npm ci` | 성공, 취약점 0건 |
| lint | 실행 가능한 lint 스크립트가 없습니다. |
| type check | 실행 가능한 type check 스크립트가 없습니다. |
| `npm test` | 성공, 1개 테스트 파일·11개 테스트 통과 |
| `npm run build` | 성공, Vite production build 생성 |
| CSP 정적 확인 | 15개 현재 페이지에서 `unsafe-inline` 제거 및 강화된 정책 확인 |
| 비밀값 정적 확인 | 추적된 `.env` 0개, 검사 패턴 일치 파일 0개 |

## 남아 있는 위험과 운영 환경에서 필요한 설정

이 저장소는 정적 GitHub Pages 사이트이므로 아래 HTTP 응답 제어는 애플리케이션 코드만으로 강제할 수 없습니다. 배포 후 실제 응답을 점검하고, 해당 제어가 꼭 필요하면 이를 지원하는 CDN·reverse proxy·호스팅 계층을 사용해야 합니다.

- HTTP 응답 헤더로 CSP를 적용하고 `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Frame-Options: DENY` 또는 CSP `frame-ancestors 'none'`, HSTS를 설정합니다.
- HTTPS만 제공하고 HSTS를 충분한 기간으로 설정합니다. preload 등록은 도메인 운영 정책과 복구 절차를 검토한 뒤 결정합니다.
- CORS는 향후 API를 도입할 때 필요한 origin만 정확히 허용하고, credentials 사용 여부를 최소화합니다. `Access-Control-Allow-Origin: *`와 credential 조합을 사용하지 않습니다.
- GitHub 저장소에서 `main` branch protection, 필수 CI 통과, 코드 리뷰, 관리자 권한 최소화, GitHub Pages environment 보호 규칙과 배포 승인 정책을 설정합니다.
- Dependabot이 올린 Action SHA·npm 업데이트 PR은 테스트와 build를 통과시킨 뒤 검토·병합합니다.
- 향후 로그인·저장·동기화·AI/API·파일 업로드·관리자 기능을 추가하면 서버 측 입력 스키마, allowlist mass assignment, 객체 소유권 검사, 세션·CSRF·rate limit, 감사 로그 마스킹, SSRF와 업로드 방어를 별도 구현·테스트해야 합니다.
- `archive/legacy`의 보관 파일은 현재 Vite 빌드에 포함되지 않습니다. 보관물을 다시 호스팅하거나 추출·배포하기 전에는 해당 버전을 독립적으로 재감사합니다.

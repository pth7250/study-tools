# 공부도구함

내신, 생기부, 시험 일정, 공부시간을 브라우저에서 계산할 수 있는 정적 멀티페이지 웹 애플리케이션입니다.

- 서비스: https://pth7250.github.io/study-tools/
- 배포: GitHub Pages
- 프레임워크: Vite + Vanilla JavaScript
- 백엔드: 없음
- 데이터베이스: 없음

## 기능

| 영역 | 도구 | 페이지 |
| --- | --- | --- |
| 내신 | 내신 종합 계산기 | [`grade.html`](src/pages/grade.html) |
| 내신 | 5등급제 예상 등급 | [`grade5.html`](src/pages/grade5.html) |
| 내신 | 9등급제 예상 등급 | [`grade9.html`](src/pages/grade9.html) |
| 내신 | 점수 평균 | [`average.html`](src/pages/average.html) |
| 내신 | 수행평가 반영점수 | [`performance.html`](src/pages/performance.html) |
| 내신 | 등수 상위비율 | [`rank.html`](src/pages/rank.html) |
| 내신 | 다음 시험 목표점수 | [`goal.html`](src/pages/goal.html) |
| 생기부 | NEIS 바이트 | [`byte.html`](src/pages/byte.html) |
| 생기부 | 글자수 | [`chars.html`](src/pages/chars.html) |
| 공부 | 공부시간 합계 | [`study.html`](src/pages/study.html) |
| 공부 | 시험까지 공부 가능시간 | [`plan.html`](src/pages/plan.html) |
| 시험 | 시험 D-Day | [`dday.html`](src/pages/dday.html) |

## 구조

```text
study-tools/
├── .github/workflows/deploy.yml  # 테스트, 빌드, GitHub Pages 배포
├── public/                       # 빌드 결과에 그대로 복사되는 정적 파일
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── pages/                    # Vite 멀티페이지 입력 HTML
│   ├── js/
│   │   ├── calculators/          # 화면과 분리된 계산 순수 함수
│   │   ├── ui/                   # 결과 표시 등 공통 UI 처리
│   │   └── main.js               # 페이지별 이벤트 연결 진입점
│   └── styles/style.css           # 기존 화면을 유지하는 공통 스타일
├── tests/                        # 계산 로직 단위 테스트
├── archive/legacy/               # 기존 ZIP 및 레거시 파일 보관
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

계산 로직은 `src/js/calculators`에 있는 순수 함수로 관리합니다. HTML은 입력과 화면 구조만 담당하고, `src/js/main.js`가 페이지의 `data-calculator` 속성을 기준으로 해당 계산기를 연결합니다.

이 프로젝트에는 사용자 계정, 데이터 저장, API 서버가 없습니다. 입력값은 브라우저 안에서만 처리됩니다. 계산 결과를 저장하거나 여러 기기에서 동기화해야 하는 요구가 생길 때만 별도의 API와 데이터베이스를 추가합니다.

## 요구 사항

- Node.js 24 이상
- npm 11 이상

버전 확인:

```bash
node --version
npm --version
```

## 시작하기

```bash
git clone https://github.com/pth7250/study-tools.git
cd study-tools
npm install
```

개발 서버 실행:

```bash
npm run dev
```

터미널에 표시된 로컬 URL을 브라우저에서 엽니다. 개발 서버를 사용하지 않고 결과물만 확인하려면 다음 명령을 사용합니다.

```bash
npm run build
npm run preview
```

## npm 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 실행 |
| `npm test` | Vitest 단위 테스트 실행 |
| `npm run build` | `dist/`에 GitHub Pages 배포 결과 생성 |
| `npm run preview` | `dist/` 결과를 로컬에서 미리보기 |

## 계산 기준

| 기능 | 계산 기준 |
| --- | --- |
| 점수 평균 | 입력 점수의 산술 평균 |
| 내신 종합 | 과목 점수와 가중치의 가중 평균 |
| 수행평가 | 시험·수행 점수와 반영비율을 합산하며 비율 합은 100% |
| 상위비율 | `석차 / 전체 인원 × 100` |
| 5·9등급제 | 석차 누적비율을 이용한 예상 구간 |
| 목표점수 | 현재 점수와 다음 시험 반영비율로 필요한 점수 역산 |
| NEIS 바이트 | 한글 3B, 영문·숫자·공백·일반 기호 1B 기준 |
| 글자수 | Unicode 기준 공백 포함·제외 글자수 |
| 공부시간 | `시:분` 형식 입력의 합계 |
| 가능시간 | `남은 일수 × 하루 공부시간` |
| D-Day | 브라우저의 오늘 날짜와 목표 날짜의 일수 차이 |

내신 등급, NEIS 바이트, 학교생활기록부 입력 제한은 학교와 교육기관의 공식 기준이 최종 기준입니다. 동점자 처리, 이수단위, 학교별 반영 방식에 따라 실제 결과가 달라질 수 있습니다.

## 새 계산기 추가

1. `src/pages/<name>.html`에 페이지를 추가합니다.
2. `<form data-calculator="<name>">`와 `[data-result]` 결과 영역을 구성합니다.
3. 계산식을 `src/js/calculators`의 순수 함수로 추가합니다.
4. `src/js/main.js`에 페이지 이벤트와 결과 문구를 연결합니다.
5. 홈 화면의 카드와 링크를 `src/pages/index.html`에 추가합니다.
6. canonical URL, `public/sitemap.xml`, 메타 설명을 갱신합니다.
7. 정상 입력, 빈 입력, 잘못된 형식에 대한 테스트를 추가합니다.

새 계산기는 기존 화면 스타일을 재사용해야 하며, 계산식과 DOM 이벤트를 HTML inline handler로 작성하지 않습니다.

## 변경 전 검증

```bash
npm test
npm run build
```

추가로 다음을 확인합니다.

- 홈의 카테고리 탭과 검색이 정상적으로 동작하는가
- 모든 계산기 페이지가 새로고침 후에도 열리는가
- 정상 입력과 잘못된 입력이 각각 처리되는가
- 결과 영역이 모바일 화면에서 잘리지 않는가
- `dist/`에 `index.html`, 각 계산기 HTML, `assets/`, `robots.txt`, `sitemap.xml`이 생성되는가
- 상대 링크와 GitHub Pages의 `/study-tools/` base 경로가 정상적으로 동작하는가

## 배포

`main` 브랜치에 push하면 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)이 다음 순서로 실행됩니다.

1. Node.js 환경을 준비합니다.
2. `npm ci`로 lockfile 기준 의존성을 설치합니다.
3. `npm test`로 계산 로직을 검증합니다.
4. `npm run build`로 `dist/`를 생성합니다.
5. `dist/`를 GitHub Pages artifact로 업로드하고 배포합니다.

저장소의 `Settings → Pages`에서 배포 source를 `GitHub Actions`로 설정해야 합니다. 소스 HTML을 루트에서 직접 배포하지 않고, 빌드된 `dist/`만 배포합니다.

## 브랜치와 커밋

```bash
git checkout -b feat/<변경 내용>
```

계산 기준 변경은 근거와 영향을 커밋 메시지나 Pull Request에 남깁니다. 화면 변경이 없는 구조 변경이라도 테스트와 빌드 결과를 함께 확인합니다.

## 데이터 및 개인정보

- 백엔드 서버와 데이터베이스가 없습니다.
- 입력한 점수와 텍스트를 저장하거나 전송하지 않습니다.
- 계산은 사용자의 브라우저에서 수행됩니다.
- 제출용 원문이나 민감한 정보는 공식 입력 화면의 정책을 우선 확인해야 합니다.

## 라이선스

현재 저장소에는 별도의 `LICENSE` 파일이 없습니다. 코드를 재사용하거나 재배포하기 전 저장소 소유자에게 사용 범위를 확인해 주세요.

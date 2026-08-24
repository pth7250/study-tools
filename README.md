# 공부도구함 📚

> 내신 계산부터 생기부 글자수, 시험 D-Day, 공부시간까지.
> 학생들이 자주 찾는 계산기를 한곳에 모은 가벼운 정적 웹 도구 모음입니다.

<p>
  <a href="https://pth7250.github.io/study-tools/"><strong>공부도구함 바로 사용하기 →</strong></a>
</p>

![공부도구함](https://img.shields.io/badge/%EA%B3%B5%EB%B6%80%EB%8F%84%EA%B5%AC%ED%95%A8-%ED%95%99%EC%83%9D%EC%9A%A9%20%EB%AC%B4%EB%A3%8C%20%EB%8F%84%EA%B5%AC-5b5ce2?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-%23E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-%231572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla%20JavaScript-%23F7DF1E?style=flat-square&logo=javascript&logoColor=%23111111)

## 왜 만들었나요?

공부하다 보면 평균을 내고, 반영점수를 계산하고, 생기부 글자수를 세고, 시험까지 며칠 남았는지 확인하는 순간이 계속 생깁니다. 공부도구함은 이런 작은 계산을 검색창과 복잡한 스프레드시트 없이 바로 끝낼 수 있도록 만든 도구함입니다.

- 회원가입 없이 바로 사용
- 별도 설치와 빌드 과정 없이 실행
- 모바일과 데스크톱을 모두 고려한 반응형 화면
- 입력값을 브라우저에서 처리하는 정적 웹사이트
- 계산 결과는 빠른 판단을 위한 참고용으로 제공

## 도구 한눈에 보기

### 🏫 내신 계산기

| 도구 | 하는 일 | 바로가기 |
| --- | --- | --- |
| 내신 종합 계산기 | 과목별 점수와 반영비율로 가중 평균 계산 | [`grade.html`](grade.html) |
| 내신 5등급제 | 석차와 전체 인원으로 5등급 예상값 계산 | [`grade5.html`](grade5.html) |
| 내신 9등급제 | 석차와 전체 인원으로 9등급 예상값 계산 | [`grade9.html`](grade9.html) |
| 점수 평균 | 여러 시험 점수의 평균 계산 | [`average.html`](average.html) |
| 수행평가 반영점수 | 시험·수행 점수와 반영비율을 합산 | [`performance.html`](performance.html) |
| 등수 상위비율 | 내 석차가 전체에서 상위 몇 %인지 계산 | [`rank.html`](rank.html) |
| 다음 시험 목표점수 | 최종 목표에 필요한 다음 시험 점수 역산 | [`goal.html`](goal.html) |

### 📝 생기부 도구

| 도구 | 하는 일 | 바로가기 |
| --- | --- | --- |
| 생기부 NEIS 바이트 | 한글 3B, 영문·숫자·공백·일반 기호 1B 기준 바이트 계산 | [`byte.html`](byte.html) |
| 생기부 글자수 | 공백 포함·제외 글자수를 동시에 확인 | [`chars.html`](chars.html) |

### ⏱️ 공부시간 도구

| 도구 | 하는 일 | 바로가기 |
| --- | --- | --- |
| 공부시간 계산 | 여러 공부 기록을 합쳐 총 공부시간 계산 | [`study.html`](study.html) |
| 시험까지 공부 가능시간 | 남은 일수와 하루 공부시간으로 총량 계산 | [`plan.html`](plan.html) |

### 📅 시험 도구

| 도구 | 하는 일 | 바로가기 |
| --- | --- | --- |
| 시험 D-Day | 시험·수행평가 날짜까지 남은 날 계산 | [`dday.html`](dday.html) |

## 사용 예시

### 점수 평균

`average.html`에서 점수를 쉼표로 입력하면 됩니다.

```text
87, 92, 76
```

결과: `평균 85.00점`

### 공부시간 합계

`study.html`에서 각 기록을 `시:분` 형식으로 입력합니다.

```text
1:30, 2:20, 0:45
```

결과: `총 공부시간 4시간 35분`

### 생기부 글자수·바이트

`byte.html` 또는 `chars.html`에 문장을 붙여 넣으면 입력하는 동안 결과가 갱신됩니다.

## 계산 기준과 주의사항

공부도구함의 결과는 빠른 확인을 위한 참고값입니다. 실제 학교·과목별 산출 기준은 학교와 교육기관의 공식 안내를 최종 기준으로 확인해 주세요.

- 5등급제·9등급제 계산은 석차 누적비율을 이용한 예상값입니다.
- 동점자 처리, 학교별 반영 방식, 이수단위 등에 따라 실제 내신 결과가 달라질 수 있습니다.
- 수행평가 환산점수는 시험과 수행평가 반영비율의 합이 100%가 되어야 합니다.
- 생기부 바이트 계산은 한글 3바이트 기준의 참고용 계산입니다.
- D-Day는 사용자의 브라우저 날짜를 기준으로 계산합니다.
- 입력한 점수와 문장은 별도 저장 기능 없이 브라우저 안에서 처리됩니다.

## 기술 스택

- HTML5
- CSS3
- Vanilla JavaScript
- 외부 프레임워크와 백엔드 서버 없음
- GitHub Pages 정적 배포

## 프로젝트 구조

```text
study-tools/
├── index.html          # 도구 모음 홈
├── app.js              # 계산 로직과 홈 화면 인터랙션
├── style.css           # 공통 스타일과 반응형 레이아웃
├── grade.html          # 내신 종합 계산기
├── grade5.html         # 5등급제 계산기
├── grade9.html         # 9등급제 계산기
├── average.html        # 점수 평균 계산기
├── performance.html    # 수행평가 반영점수 계산기
├── rank.html           # 등수 상위비율 계산기
├── goal.html           # 다음 시험 목표점수 계산기
├── byte.html           # 생기부 NEIS 바이트 계산기
├── chars.html          # 생기부 글자수 계산기
├── study.html          # 공부시간 계산기
├── plan.html           # 시험까지 공부 가능시간 계산기
├── dday.html           # 시험 D-Day 계산기
├── 404.html            # 커스텀 오류 페이지
├── robots.txt          # 검색엔진 크롤링 안내
└── sitemap.xml         # 사이트맵
```

## 로컬에서 실행하기

별도 패키지 설치가 필요 없습니다.

```bash
git clone https://github.com/pth7250/study-tools.git
cd study-tools
```

가장 간단하게는 `index.html`을 브라우저로 열면 됩니다. 로컬 서버로 확인하려면 Python이 설치된 환경에서 다음 명령을 실행하세요.

```bash
python -m http.server 8080
```

이후 [http://localhost:8080](http://localhost:8080)을 열면 됩니다.

## GitHub Pages 배포

이 프로젝트는 빌드가 필요 없는 정적 사이트라 GitHub Pages에 바로 올릴 수 있습니다.

1. 저장소의 `Settings`에서 `Pages`로 이동합니다.
2. `Deploy from a branch`를 선택합니다.
3. 브랜치로 `main`, 폴더로 `/ (root)`를 선택하고 저장합니다.
4. 잠시 후 생성된 Pages 주소에서 사이트를 확인합니다.

## 기여하기

작은 계산기 아이디어, 오탈자 수정, 접근성 개선, 모바일 UI 개선 모두 환영합니다.

1. 저장소를 Fork합니다.
2. 기능 또는 수정 브랜치를 만듭니다.
3. 변경 내용을 확인하고 Pull Request를 보냅니다.

계산 기준을 추가하거나 변경하는 경우에는 어떤 공식 기준을 참고했는지 함께 적어 주세요.

## 만든 사람

**pth7250** · 학생이 공부에 바로 쓸 수 있는 도구를 만듭니다.

<p align="center">
  <a href="https://pth7250.github.io/study-tools/">공부도구함 열기 →</a>
</p>

# SPEC-01: Title and Localization

## 목표
10개 언어 선택과 키오스크형 타이틀 흐름을 구현한다.

## 사용자 동작
언어를 고른 뒤 `언어 선택 / 이용 안내 / 크레딧` 중 이용 안내를 열고 그 안의 정상 크기 게임 시작 버튼을 누른다.

## 기술 설계
`I18n`이 영어 폴백과 보간을 제공하며 Title 장면이 2~4초 랜덤 말풍선을 관리한다.

## 의존 SPEC
SPEC-00

## 제외 범위
공식 게임명 번역, 실행 중 자동 언어 감지

## 구현 체크리스트
- [x] 최초 언어 선택
- [x] 언어 선택/이용 안내/크레딧 메뉴
- [x] 이용 안내 내부의 게임 시작 버튼
- [x] 2~4초 랜덤 말풍선
- [x] 10개 locale 데이터와 영어 폴백
- [x] 모바일 가로형 5열 언어 선택과 내부 화면 스크롤

## 인수 조건
- [x] 모든 언어 데이터에 타이틀·메뉴·말풍선 키가 존재함
- [x] 누락 키 검사 0건

## 테스트
- [x] 자동: locale 키 동등성·공유문구 보간
- [x] 자동·시각: 10개 언어 버튼 폭 측정, 긴 독일어·프랑스어 자동 축소
- [x] 데스크톱: 10개 언어 타이틀 경계 검사와 이용 안내 시작 흐름
- [x] 자동·시각: 844×390에서 10번째 언어와 이용 안내의 게임 시작 버튼 접근
- [ ] 모바일: 10개 언어 화면 실기기

## 증거
- 명령 및 결과: `npm run check`, 브라우저 29/29 통과; 10/10 타이틀의 제목·버튼·말풍선 경계/가로 overflow 0; pt-BR title→guide→Intro 흐름 검증
- 스크린샷: CJK, French, German, pt-BR representative title screens, [844×390 language menu](../evidence/runtime-mobile-menu-landscape-844x390.png), [844×390 guide](../evidence/runtime-mobile-guide-landscape-844x390.png)
- 성능 수치: 10 locale × 25 required keys; 10/10 title containment PASS
- 알려진 제한: Android/iOS 실기기 글꼴 렌더링 대기
- 상세: [polish validation](../evidence/2026-07-13-polish-validation.md)
- 모바일 보완: [fullscreen and landscape menu evidence](../evidence/2026-07-13-mobile-fullscreen-menu.md)

## 평가
기능 정확성 39/40 · 게임 감각 17/20 · 시각·오디오 13/15 · 호환성·현지화 14/15 · 코드 품질 9/10 · 총점 92/100

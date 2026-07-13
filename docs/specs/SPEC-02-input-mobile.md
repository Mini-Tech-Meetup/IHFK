# SPEC-02: Input and Mobile Landscape

## 목표
키보드와 모바일 터치를 동일한 입력 상태로 통합한다.

## 사용자 동작
데스크톱에서는 키보드, 모바일 가로에서는 스틱·점프·공격·무기 버튼을 사용한다. 세로 화면에서는 회전 안내를 따른다.

## 기술 설계
DOM 터치 컨트롤과 Phaser 키 입력을 `InputController`의 동일 상태로 정규화하며 탭 입력은 한 프레임 큐에 보존한다.

## 의존 SPEC
SPEC-00

## 제외 범위
게임패드, 세로 플레이, 브라우저가 거부한 방향 잠금 강제

## 구현 체크리스트
- [x] 방향키/1~4/Space/M
- [x] 좌측 가상 스틱
- [x] 점프·공격·무기 터치 버튼
- [x] 세로 회전 안내
- [x] 전체 화면·landscape lock 요청과 폴백

## 인수 조건
- [x] 키보드와 터치가 동일한 행동 생성
- [x] 데스크톱에서 터치 HUD 숨김

## 테스트
- [x] 자동: 강제 터치 공격 탭 큐, fullscreen/orientation 성공·거부 폴백, Android/iPhone 뷰포트 경계·겹침 0, Android Chromium/iPhone WebKit 실제 DOM 탭 무기 선택·공격
- [x] 데스크톱: 터치 HUD 숨김과 키보드 자동 주행
- [ ] Android landscape/fullscreen
- [ ] iOS manual rotate fallback
- [x] 시각 검수: 844×390 가로 FIT와 강제 터치 HUD

## 증거
- 명령 및 결과: 강제 터치 공격 탭 전달, mobile API 성공·거부 무예외, 터치 시작 x=230 안전영역 자동검사 확인
- 스크린샷: [1080×640 FastFood touch HUD](../evidence/runtime-fastfood-1080x640.png), [Android 844×390](../evidence/runtime-android-844x390.png), [iPhone 932×430](../evidence/runtime-ios-932x430.png), [portrait fallback](../evidence/runtime-mobile-portrait-390x844.png)
- 성능 수치: 입력 상태 1개로 keyboard/touch 통합
- 알려진 제한: Android/iOS 실기기 fullscreen·orientation 미검증
- 상세: [polish validation](../evidence/2026-07-13-polish-validation.md)
- 실기기 수집 도구: `/qa/device.html`, [report template](../evidence/DEVICE_QA_TEMPLATE.md)
- 에뮬레이션 매트릭스: [cross-browser QA](../evidence/2026-07-13-cross-browser-qa.md)

## 평가
기능 정확성 38/40 · 게임 감각 17/20 · 시각·오디오 12/15 · 호환성·현지화 10/15 · 코드 품질 9/10 · 총점 86/100

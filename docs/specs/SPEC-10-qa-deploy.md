# SPEC-10: QA and Deployment

## 목표
모든 요구를 증거 기반으로 검증하고 GitHub Pages 배포 가능 상태를 만든다.

## 사용자 동작
지원 브라우저에서 배포 URL을 열어 전체 캠페인, 결과 공유, 재시작과 무한 모드를 진행한다.

## 기술 설계
정적 검사, 브라우저 단위 테스트, accelerated/normal E2E, Pages-equivalent subpath, viewport/touch smoke와 증거 문서를 릴리스 게이트로 묶는다.

## 의존 SPEC
SPEC-00~09

## 제외 범위
서버 모니터링

## 구현 체크리스트
- [x] 브라우저 단위 테스트
- [x] 10개 언어 데스크톱 시각·경계 검수
- [ ] 데스크톱·Android·iOS 입력 검수
- [x] 무한 30대 데스크톱 FPS 측정
- [ ] 캠페인 15대/무한 30대 모바일 FPS 측정
- [x] README와 크레딧
- [x] PR/main 정적 검증 GitHub Actions
- [x] Chrome stable·Chromium·Firefox·WebKit WebGL 입력 smoke
- [x] Android Chromium·iPhone WebKit 가로 터치 입력 에뮬레이션
- [x] 실제 캠페인 3회 시간·평균 수집 및 복사 가능한 기기 보고서 UI

## 인수 조건
- [ ] human 평균 2:30~3:30
- [x] 공장 계산/자동 측정 35~45초 범위
- [ ] 모든 SPEC 검증 완료, 종합 90점 이상
- [x] 알려진 P0/P1 없음

## 테스트
- [x] 자동: `npm run check`, browser 35/35, headless responsive/E2E 14그룹, cross-browser 6환경
- [x] 데스크톱: 로컬 HTTP와 Pages-equivalent 경로
- [ ] 모바일: Android/iOS fullscreen·orientation·share
- [x] 시각 검수: 844×390 FIT와 touch HUD

## 증거
- 명령 및 결과: `npm run check`; browser 35/35; responsive/E2E 14/14; cross-browser 6/6; 10/10 locale containment; accelerated campaign→Result→Endless; synthetic 3-run collector boundary 2:30/3:00/3:30 → 3:00 PASS; exact 1080×640, 1080×1080 and Android/iPhone responsive captures; GitHub Actions static validation
- 스크린샷: Language, Title, 각 stage, Result, touch landscape
- 성능 수치: normal-balance automated lower bound 124.265s; factory fist 41.7s/full-reserve 36.9s; 30 active desktop min 60 / avg 60.75 / max 61 FPS; Android Chromium emulation campaign15 avg 61.5/p05 59.5; iPhone WebKit emulation endless30 avg 61.3/p05 33.3 FPS
- 알려진 제한: physical-device/native-share, human average, and post-merge live Pages verification
- 상세: [polish validation](../evidence/2026-07-13-polish-validation.md)
- 실기기 수집 도구: `/qa/device.html`, [report template](../evidence/DEVICE_QA_TEMPLATE.md)
- 브라우저 매트릭스: [cross-browser QA](../evidence/2026-07-13-cross-browser-qa.md), remote CI run 29247682557 PASS
- 실기기 스트레스 프리셋: `previewStress=15` 캠페인, `previewStress=30` 무한; 10초 후 복사 가능한 avg/p05 보고서
- 실제 시간 수집기: `?playtest`; 결과 중복 방지, run 간 locale 보존, 3회 평균/목표 판정, JSON 복사. [구현·캡처 증거](../evidence/2026-07-13-human-playtest-collector.md)

## 평가
기능 정확성 37/40 · 게임 감각 17/20 · 시각·오디오 13/15 · 호환성·현지화 10/15 · 코드 품질 9/10 · 총점 86/100

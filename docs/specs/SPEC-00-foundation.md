# SPEC-00: Phaser 4 Foundation

## 목표
Phaser 4.1.0 정적 CDN과 ES 모듈 기반의 새 루트 런타임을 구축한다.

## 사용자 동작
사용자는 정적 호스팅 URL을 열어 별도 설치 없이 언어 선택 화면에 진입한다.

## 기술 설계
루트 ES 모듈 런타임이 Phaser 4.1.0 CDN을 로드하고 Boot에서 필수 에셋을 검사한다. FIT 스케일과 상대 URL만 사용한다.

## 의존 SPEC
없음

## 제외 범위
번들러, 오프라인 캐시, Phaser 3 호환 계층

## 구현 체크리스트
- [x] Phaser 4.1.0 HTTPS CDN 고정
- [x] 1080×640 WebGL, Arcade Physics, FIT, roundPixels
- [x] Boot와 에셋 실패 화면
- [x] GitHub Pages 상대 경로
- [x] legacy 런타임 비참조

## 인수 조건
- [x] 로컬 HTTP와 Pages-equivalent `/IHFK/` 경로에서 첫 장면 로드
- [x] 콘솔에 Phaser 3 제거 API 오류 없음

## 테스트
- [x] 자동: 정적 모듈과 에셋 경로 검사
- [ ] 데스크톱: 최신 Chrome/Firefox
- [ ] 모바일: Android Chrome/iOS Safari
- [x] 시각 검수: 1080×640 캔버스와 FIT letterbox

## 증거
- 명령 및 결과: `npm run check` 통과
- 스크린샷: 로컬 Language 화면 및 844×390 FIT 확인
- 성능 수치: 소스 모듈 21개, locale 10개 정적 검사
- 알려진 제한: Firefox 및 모바일 실기기 미검증
- 상세: [QA evidence](../evidence/2026-07-13-qa.md)

## 평가
기능 정확성 40/40 · 게임 감각 18/20 · 시각·오디오 13/15 · 호환성·현지화 13/15 · 코드 품질 8/10 · 총점 92/100

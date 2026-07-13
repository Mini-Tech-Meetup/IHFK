# SPEC-03: Player and Intro

## 목표
기존 캐릭터 애니메이션과 자동 분노 컷신을 구현한다.

## 사용자 동작
현지화된 분노 대사와 변신을 본 뒤 첫 키오스크가 자동으로 깨지면 즉시 조작한다.

## 기술 설계
Intro가 컷신 타임라인·변신·첫 카운트를 소유하고 FastFood 진입 직전에 세션 타이머와 AudioService를 시작한다.

## 의존 SPEC
SPEC-00, SPEC-01

## 제외 범위
컷신 선택지, 체력, 사망, 게임 오버

## 구현 체크리스트
- [x] normal/transform 및 strong idle/run/jump/fall/attack 애니메이션
- [x] 현지화 말풍선 4개
- [x] 캐릭터 위 말풍선 앵커와 10개 언어 잘림 방지
- [x] 원본 GIF와 일치하는 29×25, 27프레임 변신 슬라이스
- [x] 자동 첫 키오스크 파괴
- [x] 조작 가능 시 타이머·BGM 시작
- [x] 체력·사망 없음

## 인수 조건
- [x] 첫 파괴가 정확히 한 번 카운트됨
- [x] 재시작 시 같은 언어로 컷신부터 시작
- [x] 캐릭터·키오스크 중심 간격 140px 이하

## 테스트
- [x] 자동: 타이머 freeze·locale-preserving reset·27프레임 픽셀 일치·10개 언어 말풍선 containment
- [x] 데스크톱: 컷신부터 FastFood 자동 전환
- [ ] 모바일: 오디오 unlock 경계 실기기
- [x] 시각 검수: normal/transform/strong 시트 렌더

## 증거
- 명령 및 결과: accelerated E2E Intro → FastFood 통과, 콘솔 오류 0
- 스크린샷: [intro dialogue](../evidence/runtime-intro-dialogue-1080x640.png), [27-frame transform](../evidence/runtime-intro-transform-1080x640.png)
- 성능 수치: transform frames 0–26; hero/kiosk center distance 135px; first auto destruction exactly once
- 알려진 제한: 모바일 오디오 unlock 실기기 대기
- 상세: [polish validation](../evidence/2026-07-13-polish-validation.md)
- 후속 검증: [intro and physics follow-up](../evidence/2026-07-13-intro-physics-followup.md)

## 평가
기능 정확성 39/40 · 게임 감각 18/20 · 시각·오디오 14/15 · 호환성·현지화 12/15 · 코드 품질 9/10 · 총점 92/100

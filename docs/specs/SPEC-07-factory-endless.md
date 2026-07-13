# SPEC-07: Factory and Endless

## 목표
5,000 HP 공장과 체력 기반 폭주, 무한 파괴 모드를 구현한다.

## 사용자 동작
오른쪽 절반의 공장 본체를 부수고 결과를 본다. 계속 부수기를 고르면 파괴된 공장에서 무한히 떨어지는 키오스크를 센다.

## 기술 설계
Factory target은 5,000 HP와 3개 낙하 profile을 가지며 마지막 타격이 타이머·BGM을 동결한다. Endless는 20초 계단식 cap을 쓴다.

## 의존 SPEC
SPEC-04, SPEC-06, SPEC-09

## 제외 범위
보스 공격, 사망, 무한 모드 타이머·종료 조건

## 구현 체크리스트
- [x] 거대 공장 본체와 3단계 파손
- [x] 컨베이어 조립·하늘 발사 배경 루프
- [x] 체력 구간별 낙하 증가
- [x] 35~45초 목표 파괴 시간
- [x] 파괴 시 타이머·BGM 정지
- [x] 무한 모드 20초 단위 밀도 증가, 최대 30대

## 인수 조건
- [x] 공장 본체는 키오스크 수에 포함되지 않음
- [x] 무한 모드에 실패 조건 없음

## 테스트
- [x] 자동: 체력 경계·공장 종료 full E2E
- [x] 데스크톱: Result→Endless 전환과 30 active stress
- [ ] 모바일: 30대 cap FPS 실기기
- [x] 시각 검수: 정상·파손·붕괴 배경

## 증거
- 명령 및 결과: normal campaign Result 도달, endless console error 0
- 스크린샷: [1080×640 30-unit Endless](../evidence/runtime-factory-stress-1080x640.png), [Result](../evidence/runtime-result-1080x640.png)
- 성능 수치: 5,000 HP; fist-only 41.7초; full-reserve 36.9초; 30 active min 60 / avg 60.75 / max 61 FPS
- 알려진 제한: 30대 모바일 FPS 실측 대기
- 상세: [polish validation](../evidence/2026-07-13-polish-validation.md)

## 평가
기능 정확성 40/40 · 게임 감각 19/20 · 시각·오디오 14/15 · 호환성·현지화 11/15 · 코드 품질 9/10 · 총점 93/100

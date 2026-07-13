# SPEC-06: Street Stage

## 목표
한 화면 전체에서 떨어지는 키오스크 50대를 파괴한다.

## 사용자 동작
화면 어디든 계속 떨어지는 키오스크를 50대 부수고, 낙하가 멈추면 남은 키오스크를 더 부수거나 오른쪽 공장 출구로 간다.

## 기술 설계
Street가 약 2초 주기 이벤트, 7번째 이벤트 묶음, 활성 12대 cap, stage별 카운트를 소유한다.

## 의존 SPEC
SPEC-04, SPEC-09

## 제외 범위
전방 스폰, 공격하는 적, 무한 스크롤

## 구현 체크리스트
- [x] 랜덤 x 낙하
- [x] 약 2초 이벤트와 3~5대 묶음
- [x] 활성 12대 상한
- [x] 50대 후 낙하 중단·공장 출구 개방
- [x] 잔여 키오스크 추가 파괴 허용
- [x] 키오스크 적층 시 지지체 파괴 후 상단 키오스크 중력 재개
- [x] 클리어 전 출구 문구 없음, 클리어 후 `GO`만 표시

## 인수 조건
- [x] 50대 전 출구 잠김
- [x] 진행 수와 전체 수 분리
- [x] 다른 키오스크 위에 멈춘 개체를 지면 고정으로 오인하지 않음

## 테스트
- [x] 자동: 50대 설정·full campaign E2E·적층 지지체 제거 회귀 테스트
- [x] 데스크톱: 낙하 상한·묶음·중단 smoke
- [ ] 모바일: 12대 상황 성능 실기기
- [x] 시각 검수: 고정 상점가 전 화면 x 낙하

## 증거
- 명령 및 결과: normal-balance E2E에서 Street → Factory 통과
- 스크린샷: street background 및 낙하 장면
- 성능 수치: interval 2000ms, cluster 3–5, cap 12, goal 50; stacked support removal drop 133.4px; grounded vx/vy 0
- 알려진 제한: 목표 모바일 FPS 실측 대기
- 상세: [polish validation](../evidence/2026-07-13-polish-validation.md)
- 후속 검증: [intro and physics follow-up](../evidence/2026-07-13-intro-physics-followup.md)

## 평가
기능 정확성 37/40 · 게임 감각 18/20 · 시각·오디오 12/15 · 호환성·현지화 12/15 · 코드 품질 9/10 · 총점 88/100

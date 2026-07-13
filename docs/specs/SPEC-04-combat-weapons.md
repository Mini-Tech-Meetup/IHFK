# SPEC-04: Combat and Weapons

## 목표
빠른 연타, 키오스크 파손과 세 소모 무기를 구현한다.

## 사용자 동작
1~4로 즉시 무기를 바꾸고 Space를 홀드해 매우 빠르게 사용한다. 소진된 무기는 깨지며 주먹으로 자동 복귀한다.

## 기술 설계
Player가 무기별 cooldown·damage·손 위치 기준 공격 사각형을 적용하고 GameSession이 잔량·상한·선택을 관리한다. 주먹은 진행 방향에서 가장 가까운 활성 키오스크 한 대만 선택한다. Kiosk는 사망 가드로 중복 카운트를 차단한다.

## 의존 SPEC
SPEC-02, SPEC-03

## 제외 범위
인벤토리 화면, 재장전, 키오스크 간 연쇄 피해

## 구현 체크리스트
- [x] 주먹 10/s
- [x] 방망이 5~6/s, 10/20회
- [x] 전기톱 20tick/s, 4/8초
- [x] 샷건 4/s, 6/12발
- [x] 15% 동등 랜덤 드롭
- [x] 소진 시 자동 주먹
- [x] 빈 슬롯 선택 차단과 소진 순간 무기 파편·효과음
- [x] 파손 3단계·날아감·파편
- [x] 파괴 순간 30~60ms hit-stop·흰 flash·강한 shake
- [x] 지면 정착 후 공격으로 수평 이동하지 않음
- [x] 낙하 키오스크 충돌 시 플레이어 넉백과 공정한 히트박스
- [x] 주먹 78×58 공격 영역을 실제 손 앞쪽 `x + 18`, 지면 기준 `y - 60`에 배치
- [x] 주먹은 겹친 대상 중 진행 방향 최전방 한 대만 타격
- [x] 무기 전신 프레임을 2.5배로 표시해 기본 캐릭터 23px×5배와 같은 약 115px 기준 키 유지
- [x] 80×48 픽업 이미지를 88×52 카드 중앙에 고정하고 물리 이동 후에도 동기화
- [x] DPS를 Balance 원본에서 자동 계산하고 모든 소모 무기가 주먹보다 높은 키오스크·공장 DPS를 가짐
- [x] 주먹 1대 / 방망이 범위 내 전체 / 전기톱 1대 집중 / 샷건 최대 3대의 타격 역할 분리

## 인수 조건
- [x] 일반 키오스크 주먹 약 1초 파괴
- [x] 연쇄 피해 없음
- [x] 파괴 수 중복 증가 없음
- [x] 낙하 충돌은 플레이어를 튕기되 체력·사망을 만들지 않음
- [x] 나란히 겹친 키오스크 두 대에서 첫 키오스크만 주먹 피해를 받음
- [x] 방망이·전기톱·샷건 사용 중 캐릭터 실루엣 기준 키가 기본 상태와 일치함
- [x] 키오스크와 공장 모두에서 방망이·전기톱·샷건 DPS가 주먹 DPS를 초과함

## 테스트
- [x] 자동: 잔량 추가·상한·소모·주먹 복귀, 전방 1대 선택, 78×58 공격 영역, 무기 스케일 2.5, 픽업 중심 정렬, DPS 우위와 1/전체/1/3 타격 프로필
- [x] 데스크톱: 1~4 선택과 Space 홀드 E2E·낙하 충돌 자동 재현
- [x] 모바일: 강제 터치 무기 선택·공격 탭
- [x] 시각 검수: 5단계 래스터 파손·파편·세 무기 전신 애니메이션

## 증거
- 명령 및 결과: `npm test` 전체 브라우저 그룹 통과, `npm run check` 통과, 래스터 무기 3종 실화면 검수
- 스크린샷: [주먹 전방 1대](../evidence/runtime-fist-front-target-1080x640.png), [방망이](../evidence/runtime-weapon-bat-height-1080x640.png), [전기톱](../evidence/runtime-weapon-chainsaw-height-1080x640.png), [샷건](../evidence/runtime-weapon-shotgun-height-1080x640.png), [픽업 정렬](../evidence/runtime-pickup-aligned-1080x640.png)
- 성능 수치: 키오스크/공장 DPS — fist 120/120, bat 211.1/144.4, chainsaw 160/140, shotgun 400/280; full-reserve factory 35.6s; player 42×88; base/weapon visible-height normalization ≈115px
- 알려진 제한: 실제 터치 홀드 감각은 모바일 실기기 대기
- 상세: [polish validation](../evidence/2026-07-13-polish-validation.md)
- 후속 검증: [intro and physics follow-up](../evidence/2026-07-13-intro-physics-followup.md)
- 타게팅·스프라이트 후속 검증: [targeting and factory follow-up](../evidence/2026-07-13-targeting-factory-followup.md)
- DPS·공유 카드 후속 검증: [DPS and share-card follow-up](../evidence/2026-07-13-dps-share-followup.md)

## 평가
기능 정확성 40/40 · 게임 감각 19/20 · 시각·오디오 14/15 · 호환성·현지화 12/15 · 코드 품질 9/10 · 총점 94/100

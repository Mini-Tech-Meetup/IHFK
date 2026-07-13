# SPEC-09: C-grade Art and Audio

## 목표
기존 캐릭터와 어울리는 의도적으로 저급한 픽셀아트와 MIDI 록을 완성한다.

## 사용자 동작
언어 선택 직후부터 더 큰 빠르고 어설픈 록을 들으며 투박한 픽셀 배경, 매 실제 타격의 둔탁한 충격음과 대사 표시음을 경험하고 M 또는 터치 아이콘으로 음소거한다.

## 기술 설계
배경은 270×160/16색 원본을 nearest-neighbor 4× 확대한다. WebAudio oscillator/sequencer가 MIDI풍 루프와 합성 효과음을 생성한다. BGM은 첫 언어 선택 제스처에서 AudioContext를 해제해 타이틀부터 재생하고, 저역 sine+square 2겹을 모든 실제 키오스크·공장 피격에 연결한다.

이미지 생성 호출은 생성 한도가 낮은 외부 자원으로 취급한다. 기존 원본의 크롭·팔레트 축소·프레임 파생으로 해결할 수 없는 핵심 원본이 필요할 때만 한 번에 1장씩 순차 생성하며, 병렬 생성과 단순 변형용 재생성은 금지한다. 무기 픽업, 파손 단계, 애니메이션 파생 프레임은 승인된 원본에서 제작한다.

## 의존 SPEC
SPEC-00, SPEC-03, SPEC-04

## 제외 범위
브랜드·로고, 고급 광원, 외부 음원 스트리밍

## 구현 체크리스트
- [x] fast-food/street/factory/broken backgrounds
- [x] kiosk damage/fragments
- [x] bat/chainsaw/shotgun six-frame full-character animations
- [x] 빠르고 어설픈 MIDI 록 루프
- [x] 최초 언어 선택부터 BGM 재생 및 재시작 컷신 즉시 재개
- [x] BGM 주요 voice 볼륨을 기존 대비 약 1.7배 상향
- [x] 타격·파괴·낙하·무기·공장 효과음
- [x] 매 실제 피격마다 68/108Hz 중심의 둔탁한 2-layer 타격음
- [x] 타이틀·컷신 대사 bubble 표시마다 dialogue 효과음
- [x] M·터치 mute
- [x] 음소거 해제 시 진행 중 BGM 자동 재개
- [x] 이미지 생성은 필수 핵심 원본만 순차 1장씩 사용
- [x] 공장 배경과 본체를 분리하고 본체를 5단계 래스터 파손 시트로 교체
- [x] 키오스크 정상 화면에 레거시 B 로고와 메뉴 UI, 파손 단계별 UI 소실 표현
- [x] hit/dialogue/break/pickup/shotgun/saw/land/weaponBreak/factory 효과음 라우팅 자동 검증
- [x] 길거리 배경에서 구름을 240×112 hard-alpha 래스터로 분리하고 반복 이동

## 인수 조건
- [x] 기존 캐릭터 5배 오버레이 시 의도한 C급 스타일 유지
- [x] 오디오가 공격 입력을 지연시키지 않음

## 테스트
- [x] 자동: 이미지 크기·정적 에셋 경로·9개 효과음 WebAudio voice 라우팅·대사 cue 횟수·BGM peak voice 0.075
- [x] 데스크톱: 오디오 루프·mute·브라우저 unlock
- [ ] 모바일: 오디오 unlock·mute 실기기
- [x] 시각 검수: 16색·nearest-neighbor·opaque 배경

## 증거
- 명령 및 결과: full campaign 및 endless에서 audio/render console error 0; 115ms louder layered MIDI voice scheduler, 2-layer low hit, dialogue bubble cue tests PASS
- 스크린샷: FastFood, [B/menu kiosk](../evidence/runtime-kiosk-menu-ui-1080x640.png), Street, Factory, broken Factory
- 성능 수치: 3 backgrounds × 1080×640, ≤16 colors; 28 generated runtime frames use hard alpha and shared ≤16-color palettes; factory follow-up image generation 1 sequential call; two music steps schedule at least nine square/saw/sine voices; strongest BGM voice 0.075; hit voices 68/108Hz nominal
- 알려진 제한: 모바일 오디오 정책 실기기 대기
- 상세: [polish validation](../evidence/2026-07-13-polish-validation.md)
- 공장 에셋 상세: [targeting and factory follow-up](../evidence/2026-07-13-targeting-factory-followup.md)
- 키오스크·사운드 상세: [DPS and share-card follow-up](../evidence/2026-07-13-dps-share-followup.md)
- 이동 구름 에셋 상세: [layer/result/cloud follow-up](../evidence/2026-07-13-layer-result-cloud-followup.md)
- 조기 BGM·타격·대사음 상세: [early music and impact audio](../evidence/2026-07-13-early-music-impact-audio.md)

## 평가
기능 정확성 38/40 · 게임 감각 19/20 · 시각·오디오 15/15 · 호환성·현지화 11/15 · 코드 품질 8/10 · 총점 91/100

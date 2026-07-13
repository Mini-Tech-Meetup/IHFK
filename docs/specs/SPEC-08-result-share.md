# SPEC-08: HUD, Result and Share

## 목표
HUD와 현재 판 결과를 구현하고, 버튼을 제외한 결과 화면 자체를 공유 이미지로 사용한다.

## 사용자 동작
플레이 중 목표·시간·무기 잔량을 보고, 완료 후 `키오스크 개뿌수기 완료` 결과 카드에서 시간과 파괴 수를 확인한 뒤 카드 밖의 재시작·계속 부수기·공유 중 하나를 고른다.

## 기술 설계
Hud가 세션을 읽고 Result가 시간을 동결한다. ShareCardService는 결과 제목, 순수 아트 포스터, 시간·파괴 영수증을 합친 1080×640 Canvas와 Web Share/PNG·clipboard 폴백을 제공한다. Result는 이 Canvas를 화면의 전체 결과 영역으로 사용하고 버튼 행만 DOM으로 분리한다.

## 의존 SPEC
SPEC-01, SPEC-04, SPEC-07

## 제외 범위
localStorage, 최고 기록, 서버 업로드

## 구현 체크리스트
- [x] 목표·진행·시간·무기 HUD
- [x] 시간·파괴 수 결과
- [x] 다시 하기·계속 부수기
- [x] 버튼이 없는 1080×640 결과 화면 공유 카드
- [x] Web Share와 PNG/clipboard 폴백
- [x] 공유 이미지·Web Share URL·clipboard에 공식 Pages 주소 고정
- [x] 왼쪽 순수 아트에 실제 정상 키오스크 2대와 최종 파손 키오스크 1대 합성
- [x] 순수 아트 내부의 중복 시간·파괴 문구 제거
- [x] 실제 1080×640 공유 Canvas를 완료 키오스크 화면 전체 결과 영역으로 표시
- [x] 완료 문구를 10개 언어의 `키오스크 개뿌수기 완료` 의미로 교체

## 인수 조건
- [x] localStorage 사용 없음
- [x] 공유 카드에 선택 언어와 #IHFK 표시
- [x] 로컬/프리뷰 주소 대신 `https://mini-tech-meetup.github.io/IHFK/` 공유
- [x] 공유 카드에 완료 제목·캐릭터·붕괴 공장·정상 2대·파손 1대·시간·파괴 수가 모두 표시됨
- [x] 화면 미리보기와 공유·저장 대상 Canvas가 동일함
- [x] 재시작·계속 부수기·공유 버튼은 공유 PNG에 포함되지 않음

## 테스트
- [x] 자동: 1080×640 Canvas·PNG 다운로드 폴백·정상/최종 파손 키오스크 텍스처·버튼 비중첩·native/fallback 공식 URL
- [x] 데스크톱: Result/Retry/Keep Breaking
- [ ] 모바일: native file share sheet
- [x] 시각 검수: 결과 화면과 카드 구성

## 증거
- 명령 및 결과: 단위 PNG fallback PASS; Web Share payload와 fallback clipboard가 canonical Pages URL을 사용; 화면 preview natural size 1080×640; 세 버튼이 공유 이미지 아래에 있음을 E2E 실측
- 스크린샷: [공식 URL이 포함된 공유 PNG 원본](../evidence/runtime-result-share-surface-1080x640.png), [버튼이 분리된 실제 Result](../evidence/runtime-result-share-surface-screen-1080x640.png)
- 성능 수치: card 1080×640 PNG; 로드된 strong character/factory/intact-kiosk/destroyed-kiosk rasters 사용 검사 PASS
- 알려진 제한: native Web Share 파일 시트 실기기 미검증
- 상세: [polish validation](../evidence/2026-07-13-polish-validation.md)
- 실기기 수집 도구: `/qa/device.html`, [report template](../evidence/DEVICE_QA_TEMPLATE.md)
- DPS·공유 카드 후속 검증: [DPS and share-card follow-up](../evidence/2026-07-13-dps-share-followup.md)
- 완료 화면 미리보기 검증: [layer/result/cloud follow-up](../evidence/2026-07-13-layer-result-cloud-followup.md)
- 결과 화면=공유 카드 후속 검증: [result share surface follow-up](../evidence/2026-07-13-result-share-surface.md)
- URL 보완: [weapon click/tap and share URL evidence](../evidence/2026-07-13-weapon-touch-share-url.md)

## 평가
기능 정확성 40/40 · 게임 감각 17/20 · 시각·오디오 14/15 · 호환성·현지화 13/15 · 코드 품질 9/10 · 총점 93/100
